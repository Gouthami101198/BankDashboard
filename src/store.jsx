import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import {
  seedCards, seedTransactions, seedInvestments, seedLoans, seedProfile, seedPrefs,
} from './data.js';

const STORAGE_KEY = 'bankdash-state-v2';

const initial = {
  cards: seedCards,
  transactions: seedTransactions,
  investments: seedInvestments,
  loans: seedLoans,
  profile: seedProfile,
  prefs: seedPrefs,
  points: 12450,
  redeemed: [],
  notifications: [
    { id: 1, text: 'Your salary of $5,600 was credited', time: '2h ago', read: false },
    { id: 2, text: 'Card ending 1234 was used at Spotify', time: 'Yesterday', read: false },
    { id: 3, text: 'Loan installment due in 3 days', time: '2 days ago', read: true },
  ],
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    return {
      ...initial,
      ...parsed,
      profile: { ...seedProfile, ...(parsed.profile || {}) },
      prefs: { ...seedPrefs, ...(parsed.prefs || {}) },
    };
  } catch {
    return initial;
  }
}

const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
const txNumber = () => `#${Math.floor(10000000 + Math.random() * 89999999)}`;
const nowIso = () => new Date().toISOString().slice(0, 16);

function notify(state, text) {
  return [{ id: nextId(state.notifications), text, time: 'Just now', read: false }, ...state.notifications].slice(0, 15);
}

function reducer(state, action) {
  switch (action.type) {
    case 'sendMoney': {
      const { to, amount } = action;
      const card = state.cards.find((c) => !c.blocked) || state.cards[0];
      return {
        ...state,
        cards: state.cards.map((c) => (c.id === card.id ? { ...c, balance: +(c.balance - amount).toFixed(2) } : c)),
        transactions: [
          { id: nextId(state.transactions), desc: `Transfer to ${to}`, txId: txNumber(), type: 'Transfer', cardId: card.id, date: nowIso(), amount: -amount },
          ...state.transactions,
        ],
        notifications: notify(state, `You sent $${amount.toLocaleString()} to ${to}`),
      };
    }
    case 'addCard':
      return {
        ...state,
        cards: [...state.cards, { ...action.card, id: nextId(state.cards), balance: 0, blocked: false }],
        notifications: notify(state, `New card ending ${action.card.number.slice(-4)} added`),
      };
    case 'toggleBlock':
      return { ...state, cards: state.cards.map((c) => (c.id === action.id ? { ...c, blocked: !c.blocked } : c)) };
    case 'removeCard':
      return { ...state, cards: state.cards.filter((c) => c.id !== action.id) };
    case 'repayLoan': {
      const loan = state.loans.find((l) => l.id === action.id);
      const pay = Math.min(action.amount, loan.left);
      return {
        ...state,
        loans: state.loans.map((l) => (l.id === action.id ? { ...l, left: l.left - pay } : l)),
        transactions: [
          { id: nextId(state.transactions), desc: `Loan repayment #${String(loan.id).padStart(2, '0')}`, txId: txNumber(), type: 'Service', cardId: state.cards[0]?.id, date: nowIso(), amount: -pay },
          ...state.transactions,
        ],
        notifications: notify(state, `Repaid $${pay.toLocaleString()} on loan #${String(loan.id).padStart(2, '0')}`),
      };
    }
    case 'applyLoan':
      return {
        ...state,
        loans: [...state.loans, { id: nextId(state.loans), amount: action.amount, left: action.amount, months: action.months, rate: action.rate }],
        notifications: notify(state, `Loan of $${action.amount.toLocaleString()} approved`),
      };
    case 'addInvestment':
      return { ...state, investments: [...state.investments, { ...action.inv, id: nextId(state.investments) }] };
    case 'redeem':
      if (state.points < action.perk.cost) return state;
      return {
        ...state,
        points: state.points - action.perk.cost,
        redeemed: [{ id: Date.now(), title: action.perk.title, cost: action.perk.cost, date: nowIso() }, ...state.redeemed],
      };
    case 'updateProfile':
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case 'updatePrefs':
      return { ...state, prefs: { ...state.prefs, ...action.prefs } };
    case 'readAll':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case 'reset':
      return initial;
    default:
      return state;
  }
}

const StoreCtx = createContext(null);

const THEME_KEY = 'bankdash-theme';

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState('');
  const timer = useRef();

  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      if (state?.prefs?.theme === 'dark' || state?.prefs?.theme === 'light') return state.prefs.theme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch {}
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  // Sync if prefs.theme updated from Settings
  useEffect(() => {
    if (state.prefs?.theme && (state.prefs.theme === 'dark' || state.prefs.theme === 'light') && state.prefs.theme !== theme) {
      setThemeState(state.prefs.theme);
    }
  }, [state.prefs?.theme]);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme);
    dispatch({ type: 'updatePrefs', prefs: { theme: nextTheme } });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((curr) => {
      const next = curr === 'dark' ? 'light' : 'dark';
      dispatch({ type: 'updatePrefs', prefs: { theme: next } });
      return next;
    });
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  }, [state]);

  const showToast = useCallback((text, kind = 'ok') => {
    clearTimeout(timer.current);
    setToast({ text, kind });
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  return (
    <StoreCtx.Provider value={{ state, dispatch, toast, showToast, query, setQuery, theme, setTheme, toggleTheme }}>
      {children}
    </StoreCtx.Provider>
  );
}

export const useStore = () => useContext(StoreCtx);

const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };

// Currency formatter that follows Settings > Preferences > Currency.
export function useMoney() {
  const { state } = useStore();
  const sym = symbols[state.prefs.currency] || '$';
  return (n, opts = {}) => {
    const abs = Math.abs(n);
    const frac = abs % 1 !== 0 ? 2 : 0;
    const s = `${sym}${abs.toLocaleString('en-US', { minimumFractionDigits: frac, maximumFractionDigits: 2 })}`;
    if (opts.sign) return `${n < 0 ? '-' : '+'}${s}`;
    return n < 0 ? `-${s}` : s;
  };
}

export function formatDate(iso, style = 'short') {
  const d = new Date(iso);
  if (style === 'long') return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  if (style === 'medium') return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date}, ${time}`;
}

export const maskCard = (num) => `${num.slice(0, 4)} **** **** ${num.slice(-4)}`;

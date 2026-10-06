import { useEffect, useRef, useState } from 'react';
import Icon from '../Icons.jsx';
import { navItems } from '../data.js';
import { useStore } from '../store.jsx';
import { go, initials } from '../utils.js';
import { sounds } from '../audio.js';
import { MarketTicker } from './ui.jsx';

export function Sidebar({ active, open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[220px] bg-surface/95 backdrop-blur-md border-r border-line py-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out md:translate-x-0 ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 px-4 pb-4 select-none">
            <div
              className="relative group cursor-pointer"
              onClick={() => {
                sounds.click();
                go('dashboard');
              }}
            >
              <img
                src="/bankdash-logo.jpg"
                alt="BankDash Logo"
                className="w-8 h-8 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-pos ring-2 ring-surface animate-pulse" />
            </div>
            <div>
              <span className="text-base font-black text-ink tracking-tight flex items-center gap-1">
                BankDash<span className="text-primary">.</span>
              </span>
              <span className="block text-[10px] text-muted font-medium -mt-0.5">Corporate Banking</span>
            </div>
            <button
              className="md:hidden ml-auto grid place-items-center w-7 h-7 rounded-lg text-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
              onClick={onClose}
              aria-label="Close menu"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-1 px-3 pt-2">
            {navItems.map((item) => {
              const isActive = active === item.key;
              return (
                <a
                  key={item.key}
                  href={`#${item.key}`}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary-soft shadow-xs font-bold'
                      : 'text-muted hover:text-ink hover:bg-surface-2 hover:translate-x-1'
                  }`}
                  onClick={() => {
                    sounds.click();
                    onClose();
                  }}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary rounded-r-full shadow-xs" />
                  )}
                  <Icon
                    name={item.icon}
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-primary' : 'text-current'
                    }`}
                    size={18}
                  />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Security / Radar Mini Widget */}
        <div className="px-3 pt-4">
          <div className="p-3 bg-gradient-to-br from-primary-soft/80 to-surface-2 rounded-2xl border border-line/75 flex flex-col gap-2 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs font-bold text-ink">
              <div className="flex items-center gap-2">
                {/* Animated Radar Scanner */}
                <div className="relative w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 grid place-items-center overflow-hidden flex-none">
                  <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/40 to-transparent animate-radar origin-center" />
                  <Icon name="shieldCheck" size={13} className="text-primary relative z-10" />
                </div>
                <span>Fraud Radar</span>
              </div>
              <span className="text-[10px] text-pos font-extrabold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pos animate-ping" />
                Active
              </span>
            </div>
            <div className="w-full bg-field rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[99%] animate-shimmer" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-muted font-medium">
              <span>99.9% Safe Vault</span>
              <span className="text-primary hover:underline cursor-pointer" onClick={() => go('settings')}>Audit</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Notifications() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const unread = state.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative w-8 h-8 md:w-9 md:h-9 rounded-full grid place-items-center bg-bg text-muted hover:text-primary hover:bg-primary-soft transition-all active:scale-95 cursor-pointer group"
        aria-label={`Notifications, ${unread} unread`}
        onClick={() => {
          sounds.click();
          setOpen((o) => !o);
        }}
      >
        <span className="transition-transform duration-200 group-hover:rotate-12">
          <Icon name="bell" size={17} />
        </span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-neg text-white text-[10px] font-bold grid place-items-center ring-2 ring-surface animate-bounce shadow-xs">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 max-w-[calc(100vw-32px)] bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex justify-between items-center px-4 py-3 border-b border-line text-ink bg-surface-2/50">
            <div className="flex items-center gap-2">
              <strong className="text-xs md:text-sm font-bold">Notifications</strong>
              {unread > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-neg text-white">
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                className="text-[11px] text-primary font-semibold hover:underline cursor-pointer"
                onClick={() => {
                  sounds.click();
                  dispatch({ type: 'readAll' });
                }}
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-72 overflow-y-auto divide-y divide-line">
            {state.notifications.map((n) => (
              <li
                key={n.id}
                className={`flex flex-col gap-1 p-3 text-xs transition-colors hover:bg-surface-2/80 ${
                  n.read ? 'text-muted' : 'bg-primary-soft/30 font-semibold text-ink'
                }`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-none" />}
                  <span className="leading-snug flex-1">{n.text}</span>
                </div>
                <small className="text-[10px] text-muted-2 pl-3.5">{n.time}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Header({ title, onMenu }) {
  const { state, query, setQuery, theme, toggleTheme, showToast } = useStore();
  const [text, setText] = useState(query);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => setText(query), [query]);

  const submit = (e) => {
    e.preventDefault();
    sounds.click();
    setQuery(text.trim());
    go('transactions');
    setMobileSearch(false);
  };

  const toggleSound = () => {
    sounds.click();
    setSoundEnabled((prev) => {
      const next = !prev;
      showToast(next ? '🔊 Audio effects enabled' : '🔇 Audio muted');
      return next;
    });
  };

  return (
    <header className="flex-none sticky top-0 z-30 flex flex-col justify-center bg-surface/85 backdrop-blur-md border-b border-line transition-colors">
      <div className="flex items-center gap-3 md:gap-5 px-4 md:px-6 py-2 min-h-[58px]">
        <button
          className="md:hidden grid place-items-center w-8 h-8 rounded-lg text-ink hover:bg-bg transition-colors cursor-pointer"
          onClick={() => {
            sounds.click();
            onMenu();
          }}
          aria-label="Open menu"
        >
          <Icon name="menu" size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-extrabold text-ink whitespace-nowrap tracking-tight">
            {title}
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted -mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pos animate-pulse" />
            <span>Encrypted • Real-Time Stream</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:gap-3">
          {/* Desktop Search Bar */}
          <form
            className="hidden md:flex items-center gap-2 w-48 lg:w-64 h-9 px-3 bg-bg rounded-full border border-line/60 focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/20 text-muted text-xs transition-all shadow-xs"
            onSubmit={submit}
            role="search"
          >
            <Icon name="search" size={15} />
            <input
              id="search"
              placeholder="Search transactions..."
              className="w-full bg-transparent border-none outline-none text-text placeholder:text-muted-2 text-xs"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {text && (
              <button
                type="button"
                className="text-muted hover:text-ink cursor-pointer"
                onClick={() => {
                  sounds.click();
                  setText('');
                  setQuery('');
                }}
                title="Clear"
              >
                <Icon name="close" size={12} />
              </button>
            )}
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-muted-2 bg-surface border border-line rounded-md">
              /
            </kbd>
          </form>

          {/* Sound FX Toggle Button */}
          <button
            type="button"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full grid place-items-center bg-bg text-muted hover:text-primary hover:bg-primary-soft transition-all active:scale-90 cursor-pointer shadow-xs"
            aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
            title={soundEnabled ? 'Mute audio effects' : 'Enable audio effects'}
            onClick={toggleSound}
          >
            <Icon name={soundEnabled ? 'volume2' : 'volumeX'} size={17} />
          </button>

          {/* Mobile search toggle */}
          <button
            type="button"
            className="md:hidden w-8 h-8 rounded-full grid place-items-center bg-bg text-muted hover:text-primary transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle mobile search"
            onClick={() => {
              sounds.click();
              setMobileSearch((s) => !s);
            }}
          >
            <Icon name="search" size={16} />
          </button>

          {/* Theme Switcher with Rotation Animation */}
          <button
            type="button"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full grid place-items-center bg-bg text-muted hover:text-accent hover:bg-accent-soft/40 transition-all active:scale-90 cursor-pointer shadow-xs"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={() => {
              sounds.click();
              toggleTheme();
            }}
          >
            <span className="transition-transform duration-300 hover:rotate-45">
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
            </span>
          </button>

          {/* Settings button */}
          <button
            className="hidden sm:grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-bg text-muted hover:text-primary hover:bg-primary-soft transition-all active:scale-95 cursor-pointer shadow-xs group"
            aria-label="Settings"
            onClick={() => {
              sounds.click();
              go('settings');
            }}
          >
            <span className="transition-transform duration-300 group-hover:rotate-90">
              <Icon name="settings" size={17} />
            </span>
          </button>

          <Notifications />

          {/* Profile Avatar with Status Badge */}
          <button
            className="relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden flex-none bg-surface-2 hover:ring-2 hover:ring-primary/50 transition-all font-bold text-ink grid place-items-center cursor-pointer shadow-xs group"
            aria-label="Edit profile"
            onClick={() => {
              sounds.click();
              go('settings');
            }}
          >
            {state.profile.avatar ? (
              <img
                src={state.profile.avatar}
                alt={state.profile.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              initials(state.profile.name)
            )}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-pos ring-1 ring-surface" />
          </button>
        </div>
      </div>

      {/* Live Financial Marquee Ticker */}
      <MarketTicker />

      {/* Expandable search bar on mobile */}
      {mobileSearch && (
        <form className="md:hidden p-3 pt-0 animate-slide-up" onSubmit={submit} role="search">
          <div className="flex items-center gap-3 w-full h-10 px-4 bg-bg rounded-full border border-primary text-muted text-sm shadow-xs">
            <Icon name="search" size={16} />
            <input
              placeholder="Search transactions, cards..."
              className="w-full bg-transparent border-none outline-none text-text placeholder:text-muted text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            {text && (
              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  setText('');
                }}
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        </form>
      )}
    </header>
  );
}

import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import Icon from '../Icons.jsx';
import { weeklyActivity, expenses, contacts, balanceHistory } from '../data.js';
import { formatDate, useMoney, useStore } from '../store.jsx';
import { Section, CreditCard, IconBadge, Panel, ConfettiBurst, FlyingCoins, go } from '../components/ui.jsx';
import { initials, txStyle } from '../utils.js';
import { useChartTheme } from '../useChartTheme.js';
import { useBreakpoint, pick } from '../useBreakpoint.js';
import { sounds } from '../audio.js';

export function TxList({ items }) {
  const money = useMoney();
  const bp = useBreakpoint();
  return (
    <Panel className="flex flex-col justify-around gap-1 flex-1 h-full p-3 md:p-3.5">
      {items.map((t) => {
        const s = txStyle[t.type] || txStyle.Transfer;
        const isNeg = t.amount < 0;
        return (
          <li
            key={t.id}
            className="group flex items-center gap-3 p-2 rounded-xl hover:bg-surface-2 transition-all duration-200 list-none cursor-pointer hover:translate-x-1"
            onClick={() => {
              sounds.click();
              go('transactions');
            }}
          >
            <div className="transition-transform group-hover:scale-110">
              <IconBadge icon={s.icon} tone={s.tone} size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs md:text-sm font-semibold text-text group-hover:text-primary transition-colors truncate">
                {t.desc}
              </div>
              <div className="text-[10px] md:text-xs text-muted mt-0.5">
                {formatDate(t.date, bp === 'tab' ? 'medium' : 'long')}
              </div>
            </div>
            <span
              className={`text-xs md:text-sm font-bold tabular-nums whitespace-nowrap px-2 py-0.5 rounded-lg transition-transform group-hover:scale-105 ${
                isNeg ? 'text-neg bg-neg-soft/50' : 'text-pos bg-pos-soft/50'
              }`}
            >
              {money(t.amount, { sign: true })}
            </span>
          </li>
        );
      })}
    </Panel>
  );
}

const RAD = Math.PI / 180;
function pieLabelClean({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  const r = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={800}>
      {Math.round(percent * 100)}%
    </text>
  );
}

function QuickTransfer() {
  const { dispatch, showToast } = useStore();
  const [selected, setSelected] = useState(1);
  const [start, setStart] = useState(0);
  const [amount, setAmount] = useState('250.00');
  const [isSending, setIsSending] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const visible = contacts.slice(start, start + 3);
  const person = contacts.find((c) => c.id === selected) || contacts[0];
  const presets = ['50', '100', '250', '500'];

  const send = (e) => {
    e.preventDefault();
    const n = Number(amount);
    if (!n || n <= 0) return showToast('Enter an amount greater than 0', 'err');

    sounds.coin();
    setIsSending(true);

    setTimeout(() => {
      dispatch({ type: 'sendMoney', to: person.name, amount: n });
      sounds.success();
      showToast(`⚡ Successfully wired $${n.toLocaleString()} to ${person.name}!`);
      setIsSending(false);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2200);
    }, 600);
  };

  return (
    <Section title="Quick Transfer" className="lg:col-span-1 h-full flex flex-col relative">
      <Panel className="relative flex flex-col justify-between gap-3.5 flex-1 h-full p-3.5 md:p-4 overflow-hidden">
        <ConfettiBurst active={confetti} />
        <FlyingCoins active={isSending} />

        <form onSubmit={send} className="flex flex-col justify-between gap-3 flex-1 relative z-10">
          {/* Contact selector avatars */}
          <div className="flex items-center justify-between gap-2">
            {visible.map((c) => {
              const isChosen = selected === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                    isChosen
                      ? 'ring-2 ring-primary bg-primary-soft shadow-xs scale-105'
                      : 'hover:bg-surface-2 hover:-translate-y-0.5'
                  }`}
                  onClick={() => {
                    sounds.click();
                    setSelected(c.id);
                  }}
                  aria-pressed={isChosen}
                >
                  <span
                    className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden flex-none text-xs font-bold text-ink grid place-items-center shadow-xs transition-transform ${
                      isChosen ? 'ring-2 ring-primary ring-offset-2 scale-105' : ''
                    }`}
                    style={{ background: c.color }}
                  >
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      initials(c.name)
                    )}
                  </span>
                  <span className="text-xs font-semibold text-text text-center line-clamp-1">{c.name}</span>
                  <span className="text-[10px] text-muted -mt-0.5">{c.role}</span>
                </button>
              );
            })}
            <button
              type="button"
              className="w-8 h-8 rounded-full grid place-items-center bg-surface border border-line shadow-xs text-primary hover:bg-primary-soft transition-all active:scale-90 flex-none cursor-pointer"
              aria-label="More contacts"
              onClick={() => {
                sounds.click();
                setStart((s) => (s + 3 >= contacts.length ? 0 : s + 1));
              }}
            >
              <Icon name="chevron" size={14} />
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider mr-1">Fast:</span>
            {presets.map((p) => (
              <button
                type="button"
                key={p}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  amount === p
                    ? 'bg-primary text-white shadow-xs scale-105'
                    : 'bg-surface-2 text-text hover:bg-primary-soft hover:text-primary active:scale-95'
                }`}
                onClick={() => {
                  sounds.click();
                  setAmount(p);
                }}
              >
                ${p}
              </button>
            ))}
          </div>

          {/* Amount input and Send button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
            <label htmlFor="amount" className="text-xs font-semibold text-muted whitespace-nowrap">
              Amount
            </label>
            <div className="flex-1 flex items-center bg-bg rounded-full border border-line/70 focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/20 pl-3 pr-1 py-1 transition-all shadow-xs">
              <span className="text-muted font-bold text-xs mr-1">$</span>
              <input
                id="amount"
                inputMode="decimal"
                className="w-full bg-transparent border-none outline-none text-text text-xs md:text-sm font-bold tabular-nums"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
              />
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-dark transition-all active:scale-95 flex-none cursor-pointer disabled:opacity-75"
              >
                {isSending ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send <Icon name="send" size={13} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Panel>
    </Section>
  );
}

export default function Dashboard() {
  const { state } = useStore();
  const bp = useBreakpoint();
  const money = useMoney();
  const { isDark, colors, chart, tooltipProps, axisTick } = useChartTheme();
  const [activeExpense, setActiveExpense] = useState(null);

  const totalBalance = state.cards.reduce((sum, c) => sum + c.balance, 0);

  return (
    <main className="flex flex-col gap-4 md:gap-5 p-3.5 md:p-5 max-w-[1700px] mx-auto w-full animate-slide-up">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-primary/12 via-surface to-accent/12 rounded-2xl border border-line/80 shadow-xs">
        <div>
          <h2 className="text-sm md:text-base font-extrabold text-ink tracking-tight flex items-center gap-2">
            Welcome back, {state.profile.name}!
            <span className="text-sm animate-bounce">👋</span>
          </h2>
          <p className="text-[11px] md:text-xs text-muted mt-0.5">
            Total liquid balance: <strong className="text-ink font-bold">{money(totalBalance)}</strong> across {state.cards.length} cards.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              sounds.click();
              go('cards');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface text-primary hover:bg-primary hover:text-white border border-line rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Icon name="card" size={14} /> + New Card
          </button>
          <button
            onClick={() => {
              sounds.click();
              go('investments');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface text-ink hover:bg-primary-soft border border-line rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Icon name="trendUp" size={14} className="text-primary" /> Invest
          </button>
          <button
            onClick={() => {
              sounds.click();
              go('privileges');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/15 text-accent-dark border border-accent/30 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Icon name="sparkles" size={14} /> {state.points.toLocaleString()} Pts
          </button>
        </div>
      </div>

      {/* Grid: Cards & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
        <Section
          title="My Cards"
          badge={`${state.cards.length} Cards`}
          className="lg:col-span-2 h-full flex flex-col"
          action={
            <button
              className="text-xs md:text-sm font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
              onClick={() => {
                sounds.click();
                go('cards');
              }}
            >
              See All <Icon name="chevron" size={12} />
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 h-full">
            {state.cards.slice(0, 2).map((c) => (
              <CreditCard key={c.id} card={c} className="h-full" onClick={() => go('cards')} />
            ))}
          </div>
        </Section>

        <Section
          title="Recent Transactions"
          className="lg:col-span-1 h-full flex flex-col"
          action={
            <button
              className="text-xs md:text-sm font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
              onClick={() => {
                sounds.click();
                go('transactions');
              }}
            >
              See All <Icon name="chevron" size={12} />
            </button>
          }
        >
          <TxList items={state.transactions.slice(0, 3)} />
        </Section>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
        <Section title="Weekly Activity" className="lg:col-span-2 h-full flex flex-col">
          <Panel className="p-3.5 md:p-4 flex-1 flex flex-col justify-center h-full">
            <ResponsiveContainer width="100%" height={pick(bp, 190, 160, 175)}>
              <BarChart data={weeklyActivity} barGap={pick(bp, 8, 6, 5)} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={chart.grid} strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} ticks={[0, 100, 200, 300, 400, 500]} />
                <Tooltip {...tooltipProps} cursor={{ fill: chart.cursor }} formatter={(v) => money(v)} />
                <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ paddingBottom: 8, fontSize: 11, fontWeight: 600 }} />
                <Bar
                  dataKey="withdraw"
                  name="Withdraw"
                  fill={isDark ? '#64748B' : '#1E293B'}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={pick(bp, 14, 11, 9)}
                />
                <Bar
                  dataKey="deposit"
                  name="Deposit"
                  fill={isDark ? '#2DD4BF' : '#0F766E'}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={pick(bp, 14, 11, 9)}
                />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </Section>

        <Section title="Expense Statistics" className="lg:col-span-1 h-full flex flex-col">
          <Panel className="p-3.5 md:p-4 flex-1 flex flex-col justify-between h-full">
            <div className="relative">
              <ResponsiveContainer width="100%" height={pick(bp, 160, 140, 150)}>
                <PieChart>
                  <Pie
                    data={expenses}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={bp === 'mobile' ? 24 : 32}
                    outerRadius={bp === 'mobile' ? 56 : 66}
                    paddingAngle={3}
                    stroke={colors.surface}
                    strokeWidth={3}
                    label={pieLabelClean}
                    labelLine={false}
                    isAnimationActive={true}
                    animationDuration={800}
                    onMouseEnter={(_, idx) => {
                      sounds.click();
                      setActiveExpense(idx);
                    }}
                    onMouseLeave={() => setActiveExpense(null)}
                  >
                    {expenses.map((e, idx) => (
                      <Cell
                        key={e.name}
                        fill={chart.categorical[idx % chart.categorical.length]}
                        opacity={activeExpense === null || activeExpense === idx ? 1 : 0.6}
                      />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipProps} formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 border-t border-line/60">
              {expenses.map((e, idx) => (
                <div
                  key={e.name}
                  className={`flex items-center gap-1.5 p-1 rounded-lg transition-all cursor-pointer ${
                    activeExpense === idx ? 'bg-surface-2 font-bold scale-102' : ''
                  }`}
                  onMouseEnter={() => {
                    sounds.click();
                    setActiveExpense(idx);
                  }}
                  onMouseLeave={() => setActiveExpense(null)}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-none shadow-xs"
                    style={{ backgroundColor: chart.categorical[idx % chart.categorical.length] }}
                  />
                  <span className="text-[10px] md:text-[11px] text-muted truncate">{e.name}</span>
                  <span className="text-[10px] md:text-[11px] font-bold text-ink ml-auto tabular-nums">
                    {e.value}%
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </Section>
      </div>

      {/* Grid: Quick Transfer & Balance History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
        <QuickTransfer />

        <Section title="Balance History" className="lg:col-span-2 h-full flex flex-col">
          <Panel className="p-3.5 md:p-4 flex-1 flex flex-col justify-center h-full">
            <ResponsiveContainer width="100%" height={pick(bp, 180, 155, 170)}>
              <AreaChart data={balanceHistory} margin={{ top: 10, right: 12, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart.primary} stopOpacity={0.35} />
                    <stop offset="90%" stopColor={chart.primary} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} ticks={[0, 200, 400, 600, 800]} />
                <Tooltip {...tooltipProps} formatter={(v) => money(v)} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke={chart.primary}
                  strokeWidth={3}
                  fill="url(#balFill)"
                  activeDot={{ r: 6, fill: chart.primary, stroke: colors.surface, strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </Section>
      </div>
    </main>
  );
}

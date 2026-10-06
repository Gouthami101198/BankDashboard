import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { debitCredit, invoices } from '../data.js';
import { formatDate, useMoney, useStore } from '../store.jsx';
import { Page, Panel, Section, StatTile, CreditCard, IconBadge, AnimatedCounter, go } from '../components/ui.jsx';
import { txStyle } from '../utils.js';
import { useChartTheme } from '../useChartTheme.js';
import { useBreakpoint, pick } from '../useBreakpoint.js';

export default function Accounts() {
  const { state } = useStore();
  const money = useMoney();
  const bp = useBreakpoint();
  const { isDark, chart, tooltipProps, axisTick } = useChartTheme();

  const balance = state.cards.reduce((s, c) => s + c.balance, 0);
  const income = state.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = state.transactions.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);
  const saving = Math.max(0, income - expense);
  const card = state.cards[0];
  const debitTotal = debitCredit.reduce((s, d) => s + d.debit, 0);
  const creditTotal = debitCredit.reduce((s, d) => s + d.credit, 0);

  return (
    <Page>
      {/* 4 Stat Tiles with trends & animated numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        <StatTile
          icon="wallet"
          tone="amber"
          label="My Balance"
          value={<AnimatedCounter value={balance} prefix="$" />}
          trend={8.2}
          onClick={() => go('cards')}
        />
        <StatTile
          icon="arrowDown"
          tone="teal"
          label="Total Income"
          value={<AnimatedCounter value={income} prefix="$" />}
          trend={14.5}
          onClick={() => go('transactions')}
        />
        <StatTile
          icon="arrowUp"
          tone="rose"
          label="Total Expense"
          value={<AnimatedCounter value={expense} prefix="$" />}
          trend={-3.1}
          onClick={() => go('transactions')}
        />
        <StatTile
          icon="piggy"
          tone="sky"
          label="Total Saving"
          value={<AnimatedCounter value={saving} prefix="$" />}
          trend={11.0}
        />
      </div>

      {/* Grid: Last Transaction & My Card */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5 items-stretch">
        <Section
          title="Last Transactions"
          className="h-full flex flex-col"
          action={
            <button
              className="text-xs md:text-sm font-bold text-primary hover:underline cursor-pointer"
              onClick={() => go('transactions')}
            >
              See All
            </button>
          }
        >
          <Panel className="flex flex-col justify-between gap-1.5 p-3.5 md:p-4 divide-y divide-line flex-1 h-full">
            {state.transactions.slice(0, 3).map((t) => {
              const s = txStyle[t.type] || txStyle.Transfer;
              const c = state.cards.find((x) => x.id === t.cardId);
              const isNeg = t.amount < 0;
              return (
                <div
                  key={t.id}
                  className="pt-2.5 first:pt-0 pb-1 flex items-center justify-between gap-3 hover:bg-surface-2/70 p-1.5 rounded-xl transition-all cursor-pointer hover:translate-x-1"
                  onClick={() => go('transactions')}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconBadge icon={s.icon} tone={s.tone} size={36} />
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm font-semibold text-text truncate">{t.desc}</div>
                      <div className="text-[10px] md:text-xs text-muted mt-0.5">{formatDate(t.date, 'long')}</div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-[11px] font-medium text-muted">{t.type}</div>
                  <div className="hidden md:block text-[11px] font-mono text-muted tabular-nums">
                    {c ? `${c.number.slice(0, 4)} ****` : '—'}
                  </div>
                  <div
                    className={`text-xs md:text-sm font-bold tabular-nums whitespace-nowrap px-2 py-0.5 rounded-lg ${
                      isNeg ? 'text-neg bg-neg-soft/50' : 'text-pos bg-pos-soft/50'
                    }`}
                  >
                    {money(t.amount, { sign: true })}
                  </div>
                </div>
              );
            })}
          </Panel>
        </Section>

        <Section
          title="My Card"
          className="h-full flex flex-col"
          action={
            <button
              className="text-xs md:text-sm font-bold text-primary hover:underline cursor-pointer"
              onClick={() => go('cards')}
            >
              See All
            </button>
          }
        >
          {card ? (
            <CreditCard card={card} className="h-full" onClick={() => go('cards')} />
          ) : (
            <Panel className="text-muted p-4 text-center text-xs flex-1 h-full">No cards yet.</Panel>
          )}
        </Section>
      </div>

      {/* Grid: Debit & Credit Overview & Invoices Sent */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5 items-stretch">
        <Section title="Debit & Credit Overview" className="h-full flex flex-col">
          <Panel className="p-3.5 md:p-4 flex-1 flex flex-col justify-between h-full">
            <p className="text-[11px] md:text-xs text-muted mb-2">
              <strong className="text-ink font-semibold">{money(debitTotal)}</strong> Debited &amp;{' '}
              <strong className="text-ink font-semibold">{money(creditTotal)}</strong> Credited this week
            </p>
            <ResponsiveContainer width="100%" height={pick(bp, 180, 155, 170)}>
              <BarChart data={debitCredit} barGap={6} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={chart.grid} strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipProps} cursor={{ fill: chart.cursor }} formatter={(v) => money(v)} />
                <Legend verticalAlign="top" align="right" iconType="square" iconSize={8} wrapperStyle={{ paddingBottom: 6, fontSize: 11, fontWeight: 600 }} />
                <Bar
                  dataKey="debit"
                  name="Debit"
                  fill={isDark ? '#64748B' : '#1E293B'}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={pick(bp, 22, 16, 12)}
                />
                <Bar
                  dataKey="credit"
                  name="Credit"
                  fill={isDark ? '#2DD4BF' : '#0F766E'}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={pick(bp, 22, 16, 12)}
                />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </Section>

        <Section title="Invoices Sent" className="h-full flex flex-col">
          <Panel className="flex flex-col justify-between gap-1.5 p-3.5 md:p-4 divide-y divide-line flex-1 h-full">
            {invoices.map((i) => (
              <div
                key={i.id}
                className="pt-2 first:pt-0 pb-1 flex items-center justify-between gap-3 hover:bg-surface-2/70 p-1.5 rounded-xl transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconBadge
                    icon={i.name.includes('Store') ? 'apple' : i.name === 'Playstation' ? 'star' : 'user'}
                    tone={i.tone}
                    size={36}
                  />
                  <div className="min-w-0">
                    <div className="text-xs md:text-sm font-semibold text-text truncate">{i.name}</div>
                    <div className="text-[10px] md:text-xs text-muted mt-0.5">{i.ago}</div>
                  </div>
                </div>
                <div className="text-xs md:text-sm font-bold text-text tabular-nums">{money(i.amount)}</div>
              </div>
            ))}
          </Panel>
        </Section>
      </div>
    </Page>
  );
}

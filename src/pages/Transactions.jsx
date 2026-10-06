import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import Icon from '../Icons.jsx';
import { monthlyExpense } from '../data.js';
import { formatDate, maskCard, useMoney, useStore } from '../store.jsx';
import { Page, Panel, Section, CreditCard, Tabs, Pagination, Modal, Empty, go } from '../components/ui.jsx';
import { useChartTheme } from '../useChartTheme.js';
import { useBreakpoint, pick } from '../useBreakpoint.js';
import { sounds } from '../audio.js';

const PER_PAGE = 5;

export default function Transactions() {
  const { state, query, setQuery, showToast } = useStore();
  const money = useMoney();
  const { colors, chart, tooltipProps, axisTick } = useChartTheme();
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(monthlyExpense.length - 1);
  const [receipt, setReceipt] = useState(null);
  const bp = useBreakpoint();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return state.transactions.filter((t) => {
      if (tab === 'income' && t.amount < 0) return false;
      if (tab === 'expense' && t.amount > 0) return false;
      if (!q) return true;
      return [t.desc, t.txId, t.type].some((v) => v.toLowerCase().includes(q));
    });
  }, [state.transactions, tab, query]);

  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  useEffect(() => setPage(1), [tab, query]);
  const shown = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const cardOf = (id) => state.cards.find((c) => c.id === id);

  return (
    <Page>
      {/* Grid: Cards & Monthly Expense */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5 items-stretch">
        <Section
          title="Linked Payment Cards"
          className="h-full flex flex-col"
          action={
            <button
              className="text-xs md:text-sm font-bold text-primary hover:underline cursor-pointer"
              onClick={() => go('cards')}
            >
              + Add Card
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 h-full">
            {state.cards.slice(0, 2).map((c) => (
              <CreditCard key={c.id} card={c} className="h-full" onClick={() => go('cards')} />
            ))}
          </div>
        </Section>

        <Section title="Monthly Expense Run-Rate" className="h-full flex flex-col">
          <Panel className="p-3.5 md:p-4 flex-1 flex flex-col justify-center h-full">
            <ResponsiveContainer width="100%" height={pick(bp, 165, 145, 155)}>
              <BarChart data={monthlyExpense} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipProps} cursor={false} formatter={(v) => money(v)} />
                <Bar
                  dataKey="value"
                  name="Expense"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                  isAnimationActive={true}
                  onMouseEnter={(_, i) => setActive(i)}
                  label={({ x, y, width, index, value }) =>
                    index === active ? (
                      <text
                        x={x + width / 2}
                        y={y - 8}
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight={700}
                        fill={colors.ink}
                      >
                        {money(value)}
                      </text>
                    ) : null
                  }
                >
                  {monthlyExpense.map((m, i) => (
                    <Cell
                      key={m.month}
                      fill={i === active ? chart.primary : chart.muted}
                      className="transition-colors duration-200"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </Section>
      </div>

      {/* Transaction History Section */}
      <Section
        title="Transaction History"
        badge={`${rows.length} Total`}
        action={
          query && (
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-bold cursor-pointer"
              onClick={() => setQuery('')}
            >
              Filter: “{query}” <Icon name="close" size={12} />
            </button>
          )
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { key: 'all', label: 'All Transactions' },
              { key: 'income', label: 'Income Only' },
              { key: 'expense', label: 'Expenses Only' },
            ]}
          />
        </div>

        <Panel className="p-0 overflow-hidden">
          {shown.length === 0 ? (
            <Empty>No transactions matched your current filters.</Empty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm divide-y divide-line">
                <thead className="bg-surface-2 text-muted text-[10px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Card</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {shown.map((t) => {
                    const isNeg = t.amount < 0;
                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-surface-2/70 transition-all cursor-pointer group"
                        onClick={() => {
                          sounds.click();
                          setReceipt(t);
                        }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-full grid place-items-center flex-none transition-transform group-hover:scale-110 ${
                                isNeg ? 'bg-neg-soft text-neg' : 'bg-pos-soft text-pos'
                              }`}
                            >
                              <Icon name={isNeg ? 'arrowUp' : 'arrowDown'} size={15} />
                            </span>
                            <span className="font-bold text-ink group-hover:text-primary transition-colors">
                              {t.desc}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted text-xs font-mono">{t.txId}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted text-xs font-medium">{t.type}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted text-xs font-mono tabular-nums">
                          {cardOf(t.cardId) ? `${cardOf(t.cardId).number.slice(0, 4)} ****` : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted text-xs font-medium">
                          {formatDate(t.date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                              isNeg ? 'text-neg bg-neg-soft/50' : 'text-pos bg-pos-soft/50'
                            }`}
                          >
                            {money(t.amount, { sign: true })}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-field text-ink hover:border-primary hover:text-primary hover:bg-primary-soft text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              sounds.click();
                              setReceipt(t);
                            }}
                          >
                            <Icon name="download" size={12} /> Voucher
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
        <Pagination page={page} pages={pages} onChange={setPage} />
      </Section>

      {/* Digital Receipt Voucher Modal */}
      {receipt && (
        <Modal
          title="Digital Payment Receipt"
          onClose={() => setReceipt(null)}
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-line text-ink hover:bg-surface-2 text-xs font-bold transition-all cursor-pointer"
                onClick={() => {
                  sounds.success();
                  showToast('Receipt printed / downloaded');
                  setReceipt(null);
                }}
              >
                <Icon name="download" size={14} /> Print PDF
              </button>
              <button
                className="inline-flex justify-center px-6 py-2 rounded-xl bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary-dark transition-all cursor-pointer shadow-xs"
                onClick={() => setReceipt(null)}
              >
                Done
              </button>
            </div>
          }
        >
          <div className="bg-surface-2/70 p-4 rounded-2xl border border-line/80 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Transaction Status</span>
                <div className="flex items-center gap-1 text-pos font-bold text-xs mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-pos animate-pulse" /> Verified &amp; Settled
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Settled Amount</span>
                <div
                  className={`text-base font-extrabold tabular-nums ${
                    receipt.amount < 0 ? 'text-neg' : 'text-pos'
                  }`}
                >
                  {money(receipt.amount, { sign: true })}
                </div>
              </div>
            </div>

            <dl className="flex flex-col divide-y divide-line/60 text-xs">
              <div className="flex justify-between py-2"><dt className="text-muted">Description</dt><dd className="font-bold text-ink">{receipt.desc}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-muted">Reference ID</dt><dd className="font-mono font-bold text-ink">{receipt.txId}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-muted">Category</dt><dd className="font-semibold text-ink">{receipt.type}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-muted">Source Card</dt><dd className="font-mono font-semibold text-ink">{cardOf(receipt.cardId) ? maskCard(cardOf(receipt.cardId).number) : '—'}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-muted">Settlement Date</dt><dd className="font-semibold text-ink">{formatDate(receipt.date)}</dd></div>
            </dl>
          </div>
        </Modal>
      )}
    </Page>
  );
}

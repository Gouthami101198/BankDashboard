import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { yearlyInvestment, monthlyRevenue, trendingStocks } from '../data.js';
import { useMoney, useStore } from '../store.jsx';
import { Page, Panel, Section, StatTile, IconBadge, Modal, Field, ConfettiBurst } from '../components/ui.jsx';
import { toneAt } from '../theme.js';
import { useChartTheme } from '../useChartTheme.js';
import { useBreakpoint, pick } from '../useBreakpoint.js';
import { sounds } from '../audio.js';

export default function Investments() {
  const { state, dispatch, showToast } = useStore();
  const money = useMoney();
  const bp = useBreakpoint();
  const { colors, chart, tooltipProps, axisTick } = useChartTheme();
  const [adding, setAdding] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', value: '' });
  const [errors, setErrors] = useState({});

  const total = 150000 + state.investments.slice(3).reduce((s, i) => s + i.value, 0);
  const count = 1250 + Math.max(0, state.investments.length - 3);
  const avgReturn = state.investments.reduce((s, i) => s + i.ret, 0) / (state.investments.length || 1);

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Enter a company name';
    if (!form.category.trim()) err.category = 'Enter a category';
    if (!(Number(form.value) > 0)) err.value = 'Enter an amount greater than 0';
    setErrors(err);
    if (Object.keys(err).length) return;

    dispatch({
      type: 'addInvestment',
      inv: {
        name: form.name.trim(),
        category: form.category.trim(),
        value: Number(form.value),
        ret: 5.4,
        tone: toneAt(state.investments.length),
      },
    });
    sounds.success();
    showToast(`🚀 Invested ${money(Number(form.value))} in ${form.name.trim()}!`);
    setForm({ name: '', category: '', value: '' });
    setAdding(false);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2000);
  };

  const lineChart = (data, color, key) => (
    <Panel className="p-3.5 md:p-4 flex-1 flex flex-col justify-center h-full">
      <ResponsiveContainer width="100%" height={pick(bp, 180, 150, 165)}>
        <LineChart data={data} margin={{ top: 10, right: 14, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
          <XAxis dataKey="year" tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => money(v)} />
          <Tooltip {...tooltipProps} formatter={(v) => money(v)} />
          <Line
            type={key === 'straight' ? 'linear' : 'monotone'}
            dataKey="value"
            name="Amount"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4, fill: colors.surface, stroke: color, strokeWidth: 2.5 }}
            activeDot={{ r: 7, fill: color, stroke: colors.surface, strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  );

  return (
    <Page>
      <ConfettiBurst active={confetti} />

      {/* 3 Stat Tiles with trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-4">
        <StatTile
          icon="dollar"
          tone="sky"
          label="Total Invested Portfolio"
          value={money(total)}
          trend={12.8}
        />
        <StatTile
          icon="chart"
          tone="rose"
          label="Active Investments"
          value={count.toLocaleString()}
          trend={4.2}
        />
        <StatTile
          icon="transfer"
          tone="teal"
          label="Average Annual Return"
          value={`${avgReturn >= 0 ? '+' : ''}${avgReturn.toFixed(2)}%`}
          trend={5.4}
        />
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-stretch">
        <Section title="Yearly Total Investment" className="h-full flex flex-col">
          {lineChart(yearlyInvestment, chart.secondary, 'straight')}
        </Section>
        <Section title="Monthly Revenue Projection" className="h-full flex flex-col">
          {lineChart(monthlyRevenue, chart.primary, 'curve')}
        </Section>
      </div>

      {/* Grid: Portfolio & Trending Stocks */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 md:gap-5 items-stretch">
        <Section
          title="My Investment Holdings"
          className="h-full flex flex-col"
          action={
            <button
              className="text-xs md:text-sm font-bold text-primary hover:underline cursor-pointer"
              onClick={() => setAdding(true)}
            >
              + New Investment
            </button>
          }
        >
          <Panel className="p-0 overflow-hidden flex-1 flex flex-col justify-around divide-y divide-line h-full">
            {state.investments.map((i) => (
              <div
                key={i.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-2/60 transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <IconBadge icon="briefcase" tone={i.tone} size={38} />
                  <div>
                    <div className="text-xs md:text-sm font-bold text-text">{i.name}</div>
                    <div className="text-[10px] md:text-xs text-muted">{i.category}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-text tabular-nums">{money(i.value)}</div>
                  <div className="text-[10px] text-muted">Invested Capital</div>
                </div>
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold tabular-nums ${
                      i.ret < 0 ? 'bg-neg-soft text-neg' : 'bg-pos-soft text-pos'
                    }`}
                  >
                    {i.ret >= 0 ? '+' : ''}{i.ret}%
                  </span>
                  <div className="text-[10px] text-muted mt-0.5">Return</div>
                </div>
              </div>
            ))}
          </Panel>
        </Section>

        <Section title="Trending Stocks" className="h-full flex flex-col">
          <Panel className="p-0 overflow-hidden flex-1 flex flex-col justify-around h-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm divide-y divide-line">
                <thead className="bg-surface-2 text-muted text-[10px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-3.5 py-3">#</th>
                    <th className="px-3.5 py-3">Asset</th>
                    <th className="px-3.5 py-3">Price</th>
                    <th className="px-3.5 py-3">24h Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {trendingStocks.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-3.5 py-3 text-muted text-xs font-mono">{String(s.id).padStart(2, '0')}.</td>
                      <td className="px-3.5 py-3 font-semibold text-text">{s.name}</td>
                      <td className="px-3.5 py-3 font-bold text-text tabular-nums">{money(s.price)}</td>
                      <td className="px-3.5 py-3">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold tabular-nums ${
                            s.ret < 0 ? 'bg-neg-soft text-neg' : 'bg-pos-soft text-pos'
                          }`}
                        >
                          {s.ret >= 0 ? '▲ +' : '▼ '}{s.ret}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </Section>
      </div>

      {/* New Investment Modal */}
      {adding && (
        <Modal title="Issue New Investment" onClose={() => setAdding(false)}>
          <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
            <Field
              id="inv-name"
              label="Company / Asset Name"
              placeholder="e.g. Apple Inc. (AAPL)"
              value={form.name}
              error={errors.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Field
              id="inv-cat"
              label="Asset Category"
              placeholder="e.g. Tech Equities, ETFs, Clean Tech"
              value={form.category}
              error={errors.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Field
              id="inv-val"
              label="Investment Amount ($)"
              inputMode="decimal"
              placeholder="5000"
              value={form.value}
              error={errors.value}
              onChange={(e) => setForm({ ...form, value: e.target.value.replace(/[^\d.]/g, '') })}
            />
            <button
              type="submit"
              className="self-start inline-flex items-center justify-center px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Confirm Investment
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}

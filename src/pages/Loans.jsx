import { useState } from 'react';
import { useMoney, useStore } from '../store.jsx';
import { Page, Panel, Section, StatTile, Modal, Field, ConfettiBurst } from '../components/ui.jsx';
import { sounds } from '../audio.js';

const installment = (l) => Math.round((l.amount * (1 + l.rate / 100)) / l.months);

export default function Loans() {
  const { state, dispatch, showToast } = useStore();
  const money = useMoney();
  const [repay, setRepay] = useState(null);
  const [repayAmt, setRepayAmt] = useState('');
  const [apply, setApply] = useState(null);
  const [form, setForm] = useState({ amount: '', months: '12' });
  const [error, setError] = useState('');
  const [confetti, setConfetti] = useState(false);

  const totals = state.loans.reduce(
    (t, l) => ({
      amount: t.amount + l.amount,
      left: t.left + l.left,
      inst: t.inst + (l.left > 0 ? installment(l) : 0),
    }),
    { amount: 0, left: 0, inst: 0 },
  );

  const openRepay = (l) => {
    sounds.click();
    setRepay(l);
    setRepayAmt(String(Math.min(installment(l), l.left)));
    setError('');
  };

  const submitRepay = (e) => {
    e.preventDefault();
    const n = Number(repayAmt);
    if (!(n > 0)) return setError('Enter an amount greater than 0');
    if (n > repay.left) return setError(`Maximum is ${money(repay.left)}`);

    dispatch({ type: 'repayLoan', id: repay.id, amount: n });
    sounds.success();
    showToast(n === repay.left ? '🎉 Loan fully cleared and closed!' : `✅ Repaid ${money(n)} towards loan!`);
    setRepay(null);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2000);
  };

  const products = [
    { key: 'Personal', icon: 'user', tone: 'teal', amount: 50000, rate: 12 },
    { key: 'Corporate', icon: 'briefcase', tone: 'amber', amount: 100000, rate: 10 },
    { key: 'Business', icon: 'chart', tone: 'rose', amount: 500000, rate: 9 },
    { key: 'Custom', icon: 'service', tone: 'sky', amount: null, rate: 11 },
  ];

  const openApply = (p) => {
    sounds.click();
    setApply(p);
    setForm({ amount: p.amount ? String(p.amount) : '25000', months: '12' });
    setError('');
  };

  const submitApply = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!(amount >= 1000)) return setError('Minimum loan is 1,000');
    dispatch({ type: 'applyLoan', amount, months: Number(form.months), rate: apply.rate });
    sounds.success();
    showToast(`🎉 ${apply.key} loan of ${money(amount)} approved and credited!`);
    setApply(null);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2200);
  };

  return (
    <Page>
      <ConfettiBurst active={confetti} />

      {/* Loan Products StatTiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {products.map((p) => (
          <StatTile
            key={p.key}
            icon={p.icon}
            tone={p.tone}
            label={`${p.key} Facility`}
            value={p.amount ? money(p.amount) : 'Custom Quote'}
            onClick={() => openApply(p)}
          />
        ))}
      </div>

      {/* Active Loans Table */}
      <Section title="Active Loan Accounts Overview" badge={`${state.loans.length} Loans`}>
        <Panel className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm divide-y divide-line">
              <thead className="bg-surface-2 text-muted text-[10px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Principal Amount</th>
                  <th className="px-4 py-3">Remaining Balance</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Interest Rate</th>
                  <th className="px-4 py-3">Installment</th>
                  <th className="px-4 py-3 text-right">Repay Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {state.loans.map((l, i) => (
                  <tr key={l.id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="px-4 py-3 text-muted text-xs font-mono">{String(i + 1).padStart(2, '0')}.</td>
                    <td className="px-4 py-3 font-bold text-text tabular-nums">{money(l.amount)}</td>
                    <td className="px-4 py-3 font-bold text-text tabular-nums">{money(l.left)}</td>
                    <td className="px-4 py-3 text-muted text-xs">{l.months} Months</td>
                    <td className="px-4 py-3 text-muted text-xs">{l.rate}% APR</td>
                    <td className="px-4 py-3 text-muted text-xs tabular-nums">
                      {l.left > 0 ? `${money(installment(l))} / mo` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {l.left > 0 ? (
                        <button
                          className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full border border-field text-ink hover:border-primary hover:text-primary hover:bg-primary-soft text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                          onClick={() => openRepay(l)}
                        >
                          Repay
                        </button>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pos-soft text-pos">
                          Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-surface-2/90 font-bold text-neg border-t border-line text-xs">
                <tr>
                  <td className="px-4 py-3 text-ink">Total Portfolio</td>
                  <td className="px-4 py-3 tabular-nums">{money(totals.amount)}</td>
                  <td className="px-4 py-3 tabular-nums">{money(totals.left)}</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 tabular-nums">{money(totals.inst)} / mo</td>
                  <td className="px-4 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </Panel>
      </Section>

      {/* Repay Modal */}
      {repay && (
        <Modal title="Make a Loan Repayment" onClose={() => setRepay(null)}>
          <form className="flex flex-col gap-4" onSubmit={submitRepay} noValidate>
            <div className="p-3 bg-surface-2 rounded-xl border border-line text-xs flex justify-between">
              <div>
                <span className="text-muted block">Remaining Loan Balance</span>
                <strong className="text-ink text-sm font-bold">{money(repay.left)}</strong>
              </div>
              <div className="text-right">
                <span className="text-muted block">Standard Monthly</span>
                <strong className="text-primary text-sm font-bold">{money(installment(repay))}</strong>
              </div>
            </div>

            <Field
              id="repay-amt"
              label="Repayment Amount ($)"
              inputMode="decimal"
              value={repayAmt}
              error={error}
              onChange={(e) => setRepayAmt(e.target.value.replace(/[^\d.]/g, ''))}
              autoFocus
            />

            <div className="flex gap-2.5 justify-end pt-2 flex-wrap">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-line text-ink hover:bg-surface-2 text-xs font-bold transition-all cursor-pointer"
                onClick={() => setRepayAmt(String(repay.left))}
              >
                Clear Entire Balance
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary-dark shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Confirm Repayment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Apply Loan Modal */}
      {apply && (
        <Modal title={`Apply for a ${apply.key} Loan Facility`} onClose={() => setApply(null)}>
          <form className="flex flex-col gap-4" onSubmit={submitApply} noValidate>
            <Field
              id="loan-amt"
              label="Loan Amount Required ($)"
              inputMode="numeric"
              value={form.amount}
              error={error}
              onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/\D/g, '') })}
              autoFocus
            />
            <Field id="loan-months" label="Repayment Tenure">
              <select
                id="loan-months"
                value={form.months}
                onChange={(e) => setForm({ ...form, months: e.target.value })}
                className="h-10 px-3.5 rounded-xl border border-field bg-surface text-text text-xs md:text-sm outline-none focus:border-primary"
              >
                {[6, 12, 24, 36, 48, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} Months ({Math.round(m / 12)} {m >= 24 ? 'Years' : 'Year'})
                  </option>
                ))}
              </select>
            </Field>

            <div className="p-3 bg-primary-soft/50 rounded-xl border border-primary/20 text-xs">
              <div className="flex justify-between items-center text-text font-medium">
                <span>Fixed Rate: <strong>{apply.rate}% APR</strong></span>
                <span>
                  Est. Installment:{' '}
                  <strong className="text-primary text-sm font-bold">
                    {money(
                      Math.round(
                        (Number(form.amount || 0) * (1 + apply.rate / 100)) / Number(form.months || 12),
                      ),
                    )}{' '}
                    / mo
                  </strong>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="self-start px-7 py-2.5 rounded-xl bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary-dark shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Instant Approval &amp; Disburse
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}

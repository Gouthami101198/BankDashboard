import { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Icon from '../Icons.jsx';
import { cardExpense } from '../data.js';
import { maskCard, useMoney, useStore } from '../store.jsx';
import { Page, Panel, Section, CreditCard, IconBadge, Modal, Field, ConfettiBurst } from '../components/ui.jsx';
import { useChartTheme } from '../useChartTheme.js';
import { useBreakpoint, pick } from '../useBreakpoint.js';
import { sounds } from '../audio.js';

const variants = ['primary', 'dark', 'light'];
const rowColors = ['teal', 'rose', 'amber', 'sky'];
const emptyForm = { type: 'Classic', holder: '', number: '', validThru: '', bank: 'DBL Bank' };

export default function CreditCards() {
  const { state, dispatch, showToast } = useStore();
  const money = useMoney();
  const bp = useBreakpoint();
  const { tooltipProps, chart } = useChartTheme();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [detail, setDetail] = useState(null);
  const [pinFor, setPinFor] = useState(null);
  const [pin, setPin] = useState('');
  const [selectedId, setSelectedId] = useState(state.cards[0]?.id);
  const [confetti, setConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selected = state.cards.find((c) => c.id === selectedId) || state.cards[0];

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addCard = (e) => {
    e.preventDefault();
    const digits = form.number.replace(/\D/g, '');
    const err = {};
    if (!form.holder.trim()) err.holder = 'Enter the name on the card';
    if (digits.length !== 16) err.number = 'Card number must be 16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.validThru)) err.validThru = 'Use MM/YY, e.g. 08/28';
    setErrors(err);
    if (Object.keys(err).length) return;

    setIsSubmitting(true);
    setTimeout(() => {
      dispatch({
        type: 'addCard',
        card: {
          variant: variants[state.cards.length % variants.length],
          bank: form.bank,
          type: form.type,
          holder: form.holder.trim(),
          number: digits.replace(/(\d{4})(?=\d)/g, '$1 '),
          validThru: form.validThru,
        },
      });
      sounds.success();
      showToast(`🎉 New ${form.type} Card issued for ${form.holder.trim()}!`);
      setForm(emptyForm);
      setIsSubmitting(false);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2200);
    }, 400);
  };

  const formatNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const settingAction = (key) => {
    if (!selected) return showToast('Add a card first', 'err');
    sounds.click();
    const last4 = selected.number.slice(-4);
    if (key === 'block') {
      dispatch({ type: 'toggleBlock', id: selected.id });
      showToast(selected.blocked ? `Card **** ${last4} unblocked` : `Card **** ${last4} blocked`);
    } else if (key === 'pin') {
      setPin('');
      setPinFor(selected);
    } else {
      showToast(`Card **** ${last4} linked to ${key}`);
    }
  };

  const savePin = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) return showToast('PIN must be 4 digits', 'err');
    sounds.success();
    showToast(`PIN updated successfully for card **** ${pinFor.number.slice(-4)}`);
    setPinFor(null);
  };

  const settings = [
    { key: 'block', icon: 'lock', tone: 'amber', title: selected?.blocked ? 'Unblock Card' : 'Block Card', sub: 'Instantly toggle card security lock' },
    { key: 'pin', icon: 'key', tone: 'teal', title: 'Change PIN Code', sub: 'Set a new secure 4-digit PIN' },
    { key: 'Google Pay', icon: 'google', tone: 'rose', title: 'Add to Google Pay', sub: 'Instant NFC tap-to-pay wallet' },
    { key: 'Apple Pay', icon: 'apple', tone: 'sky', title: 'Add to Apple Pay', sub: 'Enable FaceID contactless checkout' },
    { key: 'Apple Store', icon: 'apple', tone: 'sky', title: 'Add to Apple Store', sub: 'Default subscription card' },
  ];

  return (
    <Page>
      {/* Cards Showcase Header */}
      <Section
        title="My Cards"
        badge={`${state.cards.length} Active`}
        action={
          <span className="text-xs text-muted">
            Click any card to manage settings
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {state.cards.map((c) => {
            const isSelected = c.id === selected?.id;
            return (
              <div
                key={c.id}
                className={`w-full rounded-2xl transition-all duration-300 relative ${
                  isSelected ? 'ring-2 ring-primary ring-offset-4 ring-offset-bg scale-[1.01]' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <CreditCard card={c} className="h-full" onClick={() => setSelectedId(c.id)} />
              </div>
            );
          })}
        </div>
      </Section>

      {/* Grid: Card Expense Stats & Card List */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 md:gap-5 items-stretch">
        <Section title="Card Expense Statistics" className="h-full flex flex-col">
          <Panel className="p-3.5 md:p-4 flex-1 flex flex-col justify-center h-full">
            <ResponsiveContainer width="100%" height={pick(bp, 200, 170, 185)}>
              <PieChart>
                <Pie
                  data={cardExpense}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="50%"
                  outerRadius="78%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {cardExpense.map((e, idx) => (
                    <Cell key={e.name} fill={chart.categorical[idx % chart.categorical.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipProps} formatter={(v) => `${v}%`} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 4, fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </Panel>
        </Section>

        <Section title="Card Directory" className="h-full flex flex-col">
          <Panel className="p-0 overflow-hidden flex-1 flex flex-col justify-around divide-y divide-line h-full">
            {state.cards.map((c, i) => {
              const tone = rowColors[i % rowColors.length];
              const isSelected = c.id === selected?.id;
              return (
                <div
                  key={c.id}
                  className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected ? 'bg-primary-soft/40' : 'hover:bg-surface-2/60'
                  }`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <div className="flex items-center gap-3">
                    <IconBadge icon="card" tone={tone} size={38} />
                    <div>
                      <div className="text-xs md:text-sm font-bold text-text flex items-center gap-2">
                        {c.bank}
                        {c.blocked && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neg-soft text-neg font-bold">
                            Blocked
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] md:text-xs text-muted">{c.type} Card</div>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-[10px] text-muted uppercase font-bold tracking-wider">Number</div>
                    <div className="text-xs md:text-sm font-mono font-semibold text-text tabular-nums">
                      **** **** {c.number.slice(-4)}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-[10px] text-muted uppercase font-bold tracking-wider">Cardholder</div>
                    <div className="text-xs md:text-sm font-semibold text-text">{c.holder}</div>
                  </div>
                  <button
                    className="text-xs md:text-sm font-bold text-primary hover:underline self-end sm:self-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetail(c);
                    }}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </Panel>
        </Section>
      </div>

      {/* Grid: Add New Card & Card Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5 items-stretch relative">
        <ConfettiBurst active={confetti} />

        <Section title="Add New Card" className="h-full flex flex-col">
          <Panel className="flex flex-col justify-between gap-3.5 p-4 md:p-5 flex-1 h-full">
            <p className="text-xs text-muted leading-relaxed">
              Issue an instant virtual or physical credit card powered by Mastercard &amp; Visa global networks with 256-bit chip protection.
            </p>
            <form onSubmit={addCard} noValidate className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field id="card-type" label="Card Type">
                  <select
                    id="card-type"
                    value={form.type}
                    onChange={set('type')}
                    className="h-10 px-3.5 rounded-xl border border-field bg-surface text-text text-xs md:text-sm outline-none focus:border-primary"
                  >
                    <option>Classic</option>
                    <option>Primary</option>
                    <option>Secondary</option>
                    <option>Platinum</option>
                  </select>
                </Field>
                <Field
                  id="card-holder"
                  label="Name On Card"
                  placeholder="e.g. Charlott De Bank"
                  value={form.holder}
                  onChange={set('holder')}
                  error={errors.holder}
                />
                <Field
                  id="card-number"
                  label="Card Number"
                  placeholder="4123 4567 8901 2345"
                  inputMode="numeric"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: formatNumber(e.target.value) })}
                  error={errors.number}
                />
                <Field
                  id="card-exp"
                  label="Expiration Date"
                  placeholder="MM/YY"
                  inputMode="numeric"
                  value={form.validThru}
                  onChange={(e) => setForm({ ...form, validThru: formatExpiry(e.target.value) })}
                  error={errors.validThru}
                />
                <Field id="card-bank" label="Issuing Bank">
                  <select
                    id="card-bank"
                    value={form.bank}
                    onChange={set('bank')}
                    className="h-10 px-3.5 rounded-xl border border-field bg-surface text-text text-xs md:text-sm outline-none focus:border-primary"
                  >
                    <option>DBL Bank</option>
                    <option>BRC Bank</option>
                    <option>ABM Bank</option>
                    <option>MCP Bank</option>
                  </select>
                </Field>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-start inline-flex items-center justify-center px-7 py-2.5 rounded-xl bg-primary text-white text-xs md:text-sm font-bold shadow-xs hover:bg-primary-dark transition-all active:scale-95 cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? 'Creating Card...' : 'Issue New Card'}
              </button>
            </form>
          </Panel>
        </Section>

        <Section title="Card Settings" className="h-full flex flex-col">
          <Panel className="flex flex-col justify-between gap-2 p-3.5 md:p-4 flex-1 h-full">
            {selected && (
              <div className="flex items-center justify-between text-xs text-muted mb-1 pb-2 border-b border-line">
                <span>Selected:</span>
                <span className="font-mono font-bold text-ink bg-surface-2 px-2 py-0.5 rounded-md">
                  **** {selected.number.slice(-4)}
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col justify-between divide-y divide-line">
              {settings.map((s) => (
                <button
                  key={s.key}
                  className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-surface-2 transition-all text-left w-full group cursor-pointer hover:translate-x-1"
                  onClick={() => settingAction(s.key)}
                >
                  <IconBadge icon={s.icon} tone={s.tone} size={36} />
                  <div className="min-w-0">
                    <div className="text-xs md:text-sm font-bold text-text group-hover:text-primary transition-colors">
                      {s.title}
                    </div>
                    <div className="text-[10px] md:text-xs text-muted truncate">{s.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </Panel>
        </Section>
      </div>

      {/* Card Details Modal */}
      {detail && (
        <Modal
          title="Card Details"
          onClose={() => setDetail(null)}
          footer={
            <>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neg text-neg hover:bg-neg-soft text-sm font-bold transition-colors cursor-pointer"
                onClick={() => {
                  dispatch({ type: 'removeCard', id: detail.id });
                  showToast('Card deleted');
                  setDetail(null);
                }}
              >
                <Icon name="trash" size={16} /> Delete Card
              </button>
              <button
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark shadow-xs transition-all cursor-pointer"
                onClick={() => {
                  dispatch({ type: 'toggleBlock', id: detail.id });
                  showToast(detail.blocked ? 'Card unblocked' : 'Card blocked');
                  setDetail(null);
                }}
              >
                {state.cards.find((c) => c.id === detail.id)?.blocked ? 'Unblock Card' : 'Block Card'}
              </button>
            </>
          }
        >
          <dl className="flex flex-col divide-y divide-line text-sm">
            <div className="flex justify-between py-2.5"><dt className="text-muted">Issuing Bank</dt><dd className="font-bold text-ink">{detail.bank}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Card Tier</dt><dd className="font-bold text-ink">{detail.type}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Card Number</dt><dd className="font-mono font-bold text-ink">{maskCard(detail.number)}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Cardholder</dt><dd className="font-bold text-ink">{detail.holder}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Valid Thru</dt><dd className="font-bold text-ink">{detail.validThru}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Balance</dt><dd className="font-bold text-ink">{money(detail.balance)}</dd></div>
            <div className="flex justify-between py-2.5">
              <dt className="text-muted">Status</dt>
              <dd>
                {detail.blocked ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neg-soft text-neg">Blocked</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-pos-soft text-pos">Active</span>
                )}
              </dd>
            </div>
          </dl>
        </Modal>
      )}

      {/* Change PIN Modal */}
      {pinFor && (
        <Modal title={`Change PIN · Card **** ${pinFor.number.slice(-4)}`} onClose={() => setPinFor(null)}>
          <form className="flex flex-col gap-4" onSubmit={savePin}>
            <Field
              id="new-pin"
              label="New 4-digit Security PIN"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
            <button
              type="submit"
              className="inline-flex justify-center px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all cursor-pointer"
            >
              Update PIN
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}

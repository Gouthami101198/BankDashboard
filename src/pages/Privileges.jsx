import { useState } from 'react';
import { perks } from '../data.js';
import { formatDate, useStore } from '../store.jsx';
import { Page, Panel, Section, IconBadge, Modal, Empty, ConfettiBurst } from '../components/ui.jsx';
import Icon from '../Icons.jsx';
import { sounds } from '../audio.js';

const tiers = [
  { name: 'Silver', min: 0 },
  { name: 'Gold', min: 10000 },
  { name: 'Platinum', min: 25000 },
];
const colors = ['teal', 'amber', 'rose', 'sky'];

export default function Privileges() {
  const { state, dispatch, showToast } = useStore();
  const [confirm, setConfirm] = useState(null);
  const [confetti, setConfetti] = useState(false);

  const lifetime = state.points + state.redeemed.reduce((s, r) => s + r.cost, 0);
  const tierIdx = tiers.reduce((idx, t, i) => (lifetime >= t.min ? i : idx), 0);
  const tier = tiers[tierIdx];
  const next = tiers[tierIdx + 1];
  const progress = next ? Math.min(100, ((lifetime - tier.min) / (next.min - tier.min)) * 100) : 100;

  const redeem = () => {
    dispatch({ type: 'redeem', perk: confirm });
    sounds.success();
    showToast(`🎁 Claimed reward: ${confirm.title}!`);
    setConfirm(null);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2200);
  };

  return (
    <Page>
      <ConfettiBurst active={confetti} />

      {/* Hero Membership Banner & How to Earn */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5 items-stretch">
        <section className="bg-gradient-to-br from-[#022c22] via-[#0f766e] to-[#0d9488] rounded-3xl p-5 md:p-6 text-white flex flex-col justify-between gap-5 shadow-lg relative overflow-hidden h-full">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start gap-3 flex-wrap relative z-10">
            <div>
              <span className="micro-tag bg-white/15 text-white border border-white/20">
                VIP REWARDS PROGRAM
              </span>
              <div className="text-2xl md:text-3xl font-black mt-2 tracking-tight flex items-center gap-2">
                <Icon name="sparkles" size={24} className="text-accent" />
                {tier.name} Tier
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-white/75 font-bold">REWARD POINTS BALANCE</div>
              <div className="text-3xl md:text-4xl font-black text-accent mt-1 tabular-nums drop-shadow-sm">
                {state.points.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <div className="w-full h-3 rounded-full bg-black/25 overflow-hidden p-0.5 border border-white/10">
              <span
                className="block h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/80 font-medium">
              <span>{lifetime.toLocaleString()} lifetime points earned</span>
              <span>
                {next ? `${(next.min - lifetime).toLocaleString()} pts to ${next.name}` : 'Highest VIP Tier Reached'}
              </span>
            </div>
          </div>
        </section>

        <Section title="Earning Multipliers" className="h-full flex flex-col">
          <Panel className="flex flex-col justify-around gap-2.5 p-4 text-xs md:text-sm text-text leading-relaxed flex-1 h-full">
            <li className="list-none flex items-center gap-2.5 p-1 rounded-lg hover:bg-surface-2 transition-all">
              <span className="w-7 h-7 rounded-lg bg-teal-500/10 text-primary grid place-items-center flex-none font-bold text-xs">
                1×
              </span>
              <span><strong className="text-ink font-bold">1 pt</strong> per $1 spent on debit/credit cards</span>
            </li>
            <li className="list-none flex items-center gap-2.5 p-1 rounded-lg hover:bg-surface-2 transition-all">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-accent-dark grid place-items-center flex-none font-bold text-xs">
                500
              </span>
              <span><strong className="text-ink font-bold">500 pts</strong> on any new investment portfolio</span>
            </li>
            <li className="list-none flex items-center gap-2.5 p-1 rounded-lg hover:bg-surface-2 transition-all">
              <span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 grid place-items-center flex-none font-bold text-xs">
                2×
              </span>
              <span><strong className="text-ink font-bold">2× pts</strong> on partner dining &amp; flights</span>
            </li>
          </Panel>
        </Section>
      </div>

      {/* Rewards Catalog */}
      <Section title="Privilege Rewards Catalog" badge={`${perks.length} Available`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
          {perks.map((p, i) => {
            const tone = colors[i % colors.length];
            const afford = state.points >= p.cost;
            return (
              <Panel
                key={p.id}
                className="interactive-card p-4 flex flex-col justify-between gap-3 relative group"
              >
                <div className="flex flex-col gap-2">
                  <div className="transition-transform group-hover:scale-110">
                    <IconBadge icon={p.icon} tone={tone} size={40} />
                  </div>
                  <div className="text-xs md:text-sm font-bold text-text group-hover:text-primary transition-colors">
                    {p.title}
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex justify-between items-center gap-2.5 pt-3 border-t border-line/60">
                  <span className="text-xs md:text-sm font-bold text-ink tabular-nums flex items-center gap-1">
                    <Icon name="sparkles" size={13} className="text-accent" />
                    {p.cost.toLocaleString()} pts
                  </span>
                  <button
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      afford
                        ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 cursor-pointer'
                        : 'bg-field text-muted-2 cursor-not-allowed opacity-60'
                    }`}
                    disabled={!afford}
                    onClick={() => setConfirm(p)}
                  >
                    {afford ? 'Redeem' : 'Need More Pts'}
                  </button>
                </div>
              </Panel>
            );
          })}
        </div>
      </Section>

      {/* Redemption History */}
      <Section title="Redemption History">
        <Panel className="p-0 overflow-hidden">
          {state.redeemed.length === 0 ? (
            <Empty>You haven't claimed any perks yet. Points remain in your wallet.</Empty>
          ) : (
            <div className="divide-y divide-line">
              {state.redeemed.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-surface-2/60 transition-all hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <IconBadge icon="gift" tone="sky" size={36} />
                    <div>
                      <div className="text-xs md:text-sm font-bold text-text">{r.title}</div>
                      <div className="text-[10px] md:text-xs text-muted mt-0.5">{formatDate(r.date)}</div>
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-neg tabular-nums bg-neg-soft/50 px-2.5 py-0.5 rounded-lg">
                    -{r.cost.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </Section>

      {/* Confirm Redemption Modal */}
      {confirm && (
        <Modal
          title="Redeem VIP Reward"
          onClose={() => setConfirm(null)}
          footer={
            <div className="flex gap-2 justify-end w-full">
              <button
                className="px-4 py-2 rounded-xl border border-line text-ink hover:bg-surface-2 text-xs font-bold transition-all cursor-pointer"
                onClick={() => setConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary-dark shadow-xs transition-all cursor-pointer active:scale-95"
                onClick={redeem}
              >
                Confirm Claim
              </button>
            </div>
          }
        >
          <div className="p-4 bg-primary-soft/40 rounded-2xl border border-primary/20 text-xs md:text-sm text-text leading-relaxed">
            Redeem <strong className="text-ink font-bold">{confirm.title}</strong> for{' '}
            <strong className="text-primary font-bold">{confirm.cost.toLocaleString()} points</strong>?
            <div className="mt-2 text-xs text-muted">
              Remaining balance after claim:{' '}
              <strong className="text-ink">{(state.points - confirm.cost).toLocaleString()} points</strong>.
            </div>
          </div>
        </Modal>
      )}
    </Page>
  );
}

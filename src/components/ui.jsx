import { useEffect, useRef, useState } from 'react';
import Icon from '../Icons.jsx';
import { maskCard, useMoney, useStore } from '../store.jsx';
import { tones } from '../theme.js';
import { go } from '../utils.js';
import { sounds } from '../audio.js';

export { go };

/**
 * Animated number counter with smooth cubic-bezier easing.
 */
export function AnimatedCounter({ value, duration = 800, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(value);
  const prevVal = useRef(value);

  useEffect(() => {
    const startVal = typeof prevVal.current === 'number' ? prevVal.current : Number(prevVal.current) || 0;
    const endVal = typeof value === 'number' ? value : Number(value) || 0;

    if (startVal === endVal) return;

    let startTime = null;
    let animId;

    const step = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * ease;
      setDisplay(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setDisplay(endVal);
        prevVal.current = endVal;
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  const formatted = typeof display === 'number'
    ? display.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    : display;

  return (
    <span className="tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  );
}

/**
 * Celebratory particle / confetti explosion
 */
export function ConfettiBurst({ active }) {
  if (!active) return null;
  const particles = [
    { bg: '#10B981', tx: '-75px', ty: '-95px', rot: '45deg', delay: '0ms' },
    { bg: '#F59E0B', tx: '65px', ty: '-105px', rot: '90deg', delay: '40ms' },
    { bg: '#0284C7', tx: '-115px', ty: '-45px', rot: '-30deg', delay: '60ms' },
    { bg: '#EF4444', tx: '100px', ty: '-40px', rot: '60deg', delay: '20ms' },
    { bg: '#8B5CF6', tx: '-45px', ty: '-125px', rot: '120deg', delay: '80ms' },
    { bg: '#FBBF24', tx: '40px', ty: '-125px', rot: '-75deg', delay: '50ms' },
    { bg: '#2DD4BF', tx: '-90px', ty: '-75px', rot: '15deg', delay: '100ms' },
    { bg: '#EC4899', tx: '120px', ty: '-80px', rot: '45deg', delay: '70ms' },
    { bg: '#3B82F6', tx: '-30px', ty: '-80px', rot: '-60deg', delay: '90ms' },
    { bg: '#10B981', tx: '85px', ty: '-90px', rot: '15deg', delay: '30ms' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-visible">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute w-2.5 h-2.5 rounded-xs animate-in zoom-in-50 duration-700 ease-out pointer-events-none"
          style={{
            backgroundColor: p.bg,
            transform: `translate(${p.tx}, ${p.ty}) rotate(${p.rot})`,
            transition: 'transform 0.8s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.8s ease',
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Animated Flying Coins for Transfers
 */
export function FlyingCoins({ active }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-200 border border-amber-200 text-amber-950 font-black text-[11px] grid place-items-center shadow-lg pointer-events-none"
          style={{
            bottom: '28px',
            right: '48px',
            animation: `coin-flight 0.7s cubic-bezier(0.18, 0.89, 0.32, 1.25) ${i * 0.07}s forwards`,
          }}
        >
          $
        </span>
      ))}
    </div>
  );
}

/**
 * Live Financial Market Ticker Marquee Tape
 */
export function MarketTicker() {
  const items = [
    { symbol: 'AAPL', price: '$224.23', change: '+1.8%', pos: true },
    { symbol: 'MSFT', price: '$448.10', change: '+2.4%', pos: true },
    { symbol: 'NVDA', price: '$128.50', change: '+4.1%', pos: true },
    { symbol: 'BTC/USD', price: '$64,320', change: '+3.6%', pos: true },
    { symbol: 'ETH/USD', price: '$3,490', change: '+2.1%', pos: true },
    { symbol: 'EUR/USD', price: '1.0842', change: '-0.2%', pos: false },
    { symbol: 'S&P 500', price: '5,567.19', change: '+0.7%', pos: true },
    { symbol: 'GOLD', price: '$2,382.40', change: '+0.5%', pos: true },
  ];
  const list = [...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-surface/60 border-b border-line/60 py-1 select-none backdrop-blur-xs">
      <div className="animate-marquee flex items-center gap-8">
        {list.map((m, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
            <span className="font-extrabold text-ink">{m.symbol}</span>
            <span className="text-muted tabular-nums font-medium">{m.price}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md tabular-nums ${
                m.pos ? 'bg-pos-soft/80 text-pos' : 'bg-neg-soft/80 text-neg'
              }`}
            >
              {m.change}
            </span>
            <span className="text-line/80 ml-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Page({ className = '', children }) {
  return (
    <main className={`flex flex-col gap-4 md:gap-5 p-3.5 md:p-5 transition-all max-w-[1700px] mx-auto w-full animate-slide-up ${className}`}>
      {children}
    </main>
  );
}

export function Panel({ className = '', children, hover = false, ...props }) {
  return (
    <div
      className={`bg-surface rounded-2xl p-4 md:p-5 shadow-xs border border-line/80 transition-all ${
        hover ? 'interactive-card' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Section({ title, action, badge, className = '', children }) {
  return (
    <section className={`flex flex-col gap-2.5 min-w-0 ${className}`}>
      {(title || action || badge) && (
        <div className="flex justify-between items-center gap-2.5 min-h-[28px]">
          <div className="flex items-center gap-2">
            {title && <h2 className="text-xs md:text-sm font-bold tracking-tight text-ink">{title}</h2>}
            {badge && (
              <span className="micro-tag bg-primary-soft text-primary font-bold">
                {badge}
              </span>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function IconBadge({ icon, tone = 'teal', size = 38 }) {
  const t = tones[tone] || tones.teal;
  return (
    <span
      className="rounded-xl grid place-items-center flex-none transition-transform duration-300 group-hover:scale-110 shadow-xs"
      style={{
        background: `var(--tone-${tone}-bg, ${t.bg})`,
        color: `var(--tone-${tone}-fg, ${t.fg})`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.48)} />
    </span>
  );
}

export function StatTile({ icon, tone = 'teal', label, value, trend, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      className={`interactive-card group flex items-center gap-3.5 p-3.5 md:p-4 bg-surface rounded-2xl shadow-xs border border-line/75 text-left min-w-0 ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      }`}
      onClick={() => {
        sounds.click();
        if (onClick) onClick();
      }}
    >
      <div className="relative">
        <IconBadge icon={icon} tone={tone} size={42} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xs text-muted font-medium truncate">{label}</div>
          {trend !== undefined && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                trend >= 0 ? 'bg-pos-soft text-pos' : 'bg-neg-soft text-neg'
              }`}
            >
              <Icon name={trend >= 0 ? 'arrowUp' : 'arrowDown'} size={10} strokeWidth={2.5} />
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className="text-sm md:text-base font-bold text-ink mt-0.5 truncate tracking-tight tabular-nums">
          {value}
        </div>
      </div>
    </Tag>
  );
}

/**
 * 3D Interactive Perspective Credit Card with Double-Sided Flip and Holographic Glare
 */
export function CreditCard({ card, onClick, className = '' }) {
  const money = useMoney();
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const rotateX = ((y / height) - 0.5) * -18;
    const rotateY = ((x / width) - 0.5) * 18;
    const glareX = (x / width) * 100;
    const glareY = (y / height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  };

  const toggleFlip = (e) => {
    e.stopPropagation();
    sounds.flip();
    setIsFlipped((f) => !f);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  };

  const isLight = card.variant === 'light';
  const isPrimary = card.variant === 'primary';

  const bgClass = isLight
    ? 'bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] text-ink border border-line/90 shadow-sm'
    : isPrimary
      ? 'bg-gradient-to-br from-[#0f766e] via-[#0d6e67] to-[#042f2e] text-white shadow-md'
      : 'bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] text-white shadow-md';

  return (
    <div className="card-flip-container h-full w-full min-h-[185px] md:min-h-[195px]">
      <div
        className={`card-flip-inner ${isFlipped ? 'is-flipped' : ''}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: !isFlipped && tilt.active
            ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
            : isFlipped
              ? 'rotateY(180deg)'
              : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        }}
        onClick={onClick}
      >
        {/* FRONT OF CARD */}
        <div
          className={`card-face flex flex-col justify-between overflow-hidden select-none card-3d ${bgClass} ${
            card.blocked ? 'grayscale opacity-75' : ''
          } ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
          {/* Dynamic Holographic Glare Layer */}
          {tilt.active && !isFlipped && (
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl z-30 transition-opacity duration-150"
              style={{
                background: `radial-gradient(circle 180px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 50%, transparent 75%)`,
                mixBlendMode: isLight ? 'overlay' : 'screen',
              }}
            />
          )}

          {/* Ambient background glow orbs */}
          {!isLight && (
            <>
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-accent/15 rounded-full blur-xl pointer-events-none" />
            </>
          )}

          {/* Micro-grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Top bar: Balance, Chip & 3D Flip button */}
          <div className="p-4 pb-0 relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(20px)' }}>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] md:text-[11px] uppercase tracking-wider font-semibold ${isLight ? 'text-muted' : 'text-white/75'}`}>
                  Balance
                </span>
                {isPrimary && (
                  <span className="micro-tag bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Primary
                  </span>
                )}
              </div>
              <div className="text-base md:text-xl font-extrabold mt-1 tracking-tight tabular-nums drop-shadow-xs">
                {money(card.balance)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {card.blocked ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neg-soft text-neg shadow-xs">
                  Blocked
                </span>
              ) : (
                <>
                  <div className="opacity-80" title="Contactless Enabled">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={isLight ? 'text-text' : 'text-white'}>
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-2.5" />
                      <path d="M12 17a6 6 0 0 0 0-10" />
                      <path d="M15.5 19.5a10 10 0 0 0 0-15" />
                    </svg>
                  </div>
                  <div className="w-8 h-6 rounded-md chip-metallic border border-amber-300/40 grid place-items-center shadow-xs">
                    <div className="w-5 h-4 border border-amber-900/30 rounded-xs grid grid-cols-2 grid-rows-2">
                      <span className="border-r border-b border-amber-900/30" />
                      <span className="border-b border-amber-900/30" />
                      <span className="border-r border-amber-900/30" />
                      <span />
                    </div>
                  </div>
                </>
              )}

              {/* 3D Flip Trigger Button */}
              <button
                type="button"
                onClick={toggleFlip}
                className="w-6.5 h-6.5 rounded-full bg-white/20 hover:bg-white/30 text-current grid place-items-center transition-transform hover:scale-110 active:scale-90 cursor-pointer ml-1"
                title="Flip to view card back"
                aria-label="Flip card"
              >
                <Icon name="transfer" size={12} />
              </button>
            </div>
          </div>

          {/* Card Holder & Expiry */}
          <div className="flex gap-7 px-4 pt-3 relative z-10" style={{ transform: 'translateZ(14px)' }}>
            <div>
              <div className={`text-[10px] uppercase tracking-widest font-semibold ${isLight ? 'text-muted' : 'text-white/70'}`}>CARD HOLDER</div>
              <div className="text-xs md:text-sm font-bold mt-0.5 whitespace-nowrap tracking-wide">{card.holder}</div>
            </div>
            <div>
              <div className={`text-[10px] uppercase tracking-widest font-semibold ${isLight ? 'text-muted' : 'text-white/70'}`}>VALID THRU</div>
              <div className="text-xs md:text-sm font-bold mt-0.5 whitespace-nowrap tabular-nums tracking-wide">{card.validThru}</div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className={`mt-auto flex justify-between items-center px-4 py-2.5 text-xs font-medium tracking-wider relative z-10 ${
              isLight ? 'border-t border-line/80 bg-white/75 backdrop-blur-xs' : 'border-t border-white/10 bg-white/10 backdrop-blur-sm'
            }`}
            style={{ transform: 'translateZ(16px)' }}
          >
            <span className="tabular-nums tracking-widest text-xs md:text-sm font-mono font-semibold drop-shadow-xs">
              {maskCard(card.number)}
            </span>
            <span className="flex items-center -space-x-2 flex-none" aria-hidden="true">
              <i className={`inline-block w-5 h-5 rounded-full ${isLight ? 'bg-rose-500/85' : 'bg-rose-500/90'} shadow-xs`} />
              <i className="inline-block w-5 h-5 rounded-full bg-accent/90 shadow-xs" />
            </span>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div
          className={`card-face card-face-back flex flex-col justify-between overflow-hidden select-none ${bgClass} p-0 shadow-lg`}
        >
          {/* Top Magnetic Stripe */}
          <div className="w-full h-9 bg-slate-950 mt-3 border-y border-black/40 shadow-inner" />

          {/* Signature Strip & CVV Box */}
          <div className="px-4 py-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-semibold opacity-75">
                Authorized Signature
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold opacity-75">
                Security Code
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-7.5 bg-white text-slate-900 rounded-sm px-3 flex items-center font-mono text-xs md:text-sm italic tracking-wider shadow-inner select-none">
                {card.holder}
              </div>
              <div className="w-14 h-7.5 bg-amber-100 text-slate-950 font-mono font-black text-xs md:text-sm grid place-items-center rounded-sm shadow-xs border border-amber-300">
                842
              </div>
            </div>
          </div>

          {/* Bottom Back Bar with Holographic Seal & Flip Back Button */}
          <div className="px-4 pb-3 flex items-center justify-between text-[10px] opacity-80">
            <div className="leading-tight">
              <span>24/7 Global Concierge: 1-800-BANKDASH</span>
              <br />
              <span>Issued by {card.bank} under Mastercard license.</span>
            </div>
            <button
              type="button"
              onClick={toggleFlip}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-current text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Icon name="transfer" size={11} /> Flip Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md grid place-items-center p-3.5 animate-in fade-in duration-200"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg max-h-[calc(100vh-32px)] overflow-y-auto bg-surface rounded-3xl shadow-2xl border border-line p-5 md:p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex justify-between items-center gap-3 pb-3 border-b border-line">
          <h3 className="text-base md:text-lg font-bold text-ink">{title}</h3>
          <button
            className="grid place-items-center w-8 h-8 rounded-full text-muted hover:text-ink hover:bg-bg transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-3 text-xs md:text-sm text-text">{children}</div>
        {footer && <div className="flex justify-end gap-2.5 pt-3 border-t border-line/60 flex-wrap">{footer}</div>}
      </div>
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-2 p-1 bg-surface-2 rounded-xl border border-line/60 overflow-x-auto scrollbar-none w-fit" role="tablist">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={active}
            className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all font-medium cursor-pointer ${
              active
                ? 'bg-surface text-primary font-semibold shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
            onClick={() => {
              sounds.click();
              onChange(t.key);
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({ id, checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none group" htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => {
            sounds.click();
            onChange(e.target.checked);
          }}
        />
        <div className="w-12 h-6 bg-field rounded-full transition-colors peer-checked:bg-primary group-hover:brightness-95"></div>
        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-surface rounded-full shadow-md transition-transform peer-checked:translate-x-6"></div>
      </div>
      <span className="text-xs md:text-sm text-text font-medium">{label}</span>
    </label>
  );
}

export function Field({ id, label, error, children, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label htmlFor={id} className="text-xs md:text-sm font-medium text-ink">{label}</label>
      {children || (
        <input
          id={id}
          className={`h-9 md:h-10 px-3.5 rounded-xl border bg-surface text-text text-xs md:text-sm outline-none transition-all placeholder:text-muted-2 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            error ? 'border-neg' : 'border-field hover:border-line'
          }`}
          {...inputProps}
        />
      )}
      {error && <span className="text-[11px] text-neg font-medium">{error}</span>}
    </div>
  );
}

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <nav className="flex justify-end items-center gap-1.5 flex-wrap pt-2.5" aria-label="Pagination">
      <button
        disabled={page === 1}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-primary text-xs font-semibold hover:bg-primary-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        onClick={() => {
          sounds.click();
          onChange(page - 1);
        }}
      >
        <Icon name="chevronLeft" size={14} /> Previous
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={`w-7 h-7 rounded-lg text-xs font-semibold grid place-items-center transition-all cursor-pointer ${
            n === page
              ? 'bg-primary text-white shadow-xs scale-105'
              : 'text-primary hover:bg-primary-soft'
          }`}
          onClick={() => {
            sounds.click();
            onChange(n);
          }}
        >
          {n}
        </button>
      ))}
      <button
        disabled={page === pages}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-primary text-xs font-semibold hover:bg-primary-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        onClick={() => {
          sounds.click();
          onChange(page + 1);
        }}
      >
        Next <Icon name="chevron" size={14} />
      </button>
    </nav>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  const isErr = toast.kind === 'err';
  return (
    <div
      className={`fixed left-1/2 bottom-7 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl font-semibold text-xs md:text-sm text-white flex items-center gap-3 animate-slide-up border ${
        isErr ? 'bg-neg border-red-400' : 'bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md border-slate-700/60'
      }`}
      role="status"
    >
      <span
        className={`w-6 h-6 rounded-full grid place-items-center flex-none text-xs font-bold ${
          isErr ? 'bg-white/20 text-white' : 'bg-primary text-white shadow-xs'
        }`}
      >
        {isErr ? '!' : '✓'}
      </span>
      <span>{toast.text}</span>
    </div>
  );
}

export function Empty({ children }) {
  return (
    <div className="p-8 text-center text-muted font-medium flex flex-col items-center justify-center gap-2">
      <span className="w-10 h-10 rounded-full bg-field/60 grid place-items-center text-muted">
        <Icon name="search" size={18} />
      </span>
      <span>{children}</span>
    </div>
  );
}

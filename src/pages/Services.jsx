import { useState } from 'react';
import { services } from '../data.js';
import { useStore } from '../store.jsx';
import { Page, Panel, Section, StatTile, IconBadge, Modal } from '../components/ui.jsx';

const featured = [
  { key: 'life', icon: 'heart', tone: 'teal', label: 'Life Protection', value: '100% Comprehensive', service: 5 },
  { key: 'shop', icon: 'bag', tone: 'amber', label: 'Commercial Banking', value: 'Buy. Scale. Grow.', service: 4 },
  { key: 'safe', icon: 'shield', tone: 'sky', label: 'Fraud Shield', value: '24/7 AI Monitoring', service: 2 },
];

export default function Services() {
  const { showToast } = useStore();
  const [open, setOpen] = useState(null);

  return (
    <Page>
      {/* Featured Services Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-4">
        {featured.map((f) => (
          <StatTile
            key={f.key}
            icon={f.icon}
            tone={f.tone}
            label={f.label}
            value={f.value}
            onClick={() => setOpen(services.find((s) => s.id === f.service))}
          />
        ))}
      </div>

      {/* Full Services Directory */}
      <Section title="Institutional Banking Services" badge={`${services.length} Solutions`}>
        <Panel className="p-0 overflow-hidden divide-y divide-line">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-3.5 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-2/70 transition-all hover:translate-x-1"
            >
              <div className="flex items-center gap-3 min-w-[220px]">
                <IconBadge icon={s.icon} tone={s.tone} size={40} />
                <div>
                  <div className="text-xs md:text-sm font-bold text-text">{s.name}</div>
                  <div className="text-[10px] md:text-xs text-muted">{s.sub}</div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-6 md:gap-10">
                {s.cols.map(([a, b], i) => (
                  <div key={i} className={i === 2 ? 'hidden lg:block' : ''}>
                    <div className="text-[11px] md:text-xs font-bold text-text">{a}</div>
                    <div className="text-[10px] md:text-xs text-muted">{b}</div>
                  </div>
                ))}
              </div>
              <button
                className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all self-end sm:self-center cursor-pointer shadow-xs active:scale-95"
                onClick={() => setOpen(s)}
              >
                Inquire &amp; Activate
              </button>
            </div>
          ))}
        </Panel>
      </Section>

      {/* Service Details Modal */}
      {open && (
        <Modal
          title={open.name}
          onClose={() => setOpen(null)}
          footer={
            <div className="flex gap-2 justify-end w-full">
              <button
                className="px-4 py-2 rounded-xl border border-line text-ink hover:bg-surface-2 text-xs font-bold transition-all cursor-pointer"
                onClick={() => setOpen(null)}
              >
                Close
              </button>
              <button
                className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary-dark shadow-xs transition-all cursor-pointer active:scale-95"
                onClick={() => {
                  showToast(`✅ Request dispatched for ${open.name}. An advisor will reach out.`);
                  setOpen(null);
                }}
              >
                Confirm Request
              </button>
            </div>
          }
        >
          <p className="text-xs md:text-sm text-muted leading-relaxed">{open.detail}</p>
          <div className="bg-surface-2 p-3.5 rounded-2xl border border-line/70 mt-1">
            <dl className="flex flex-col divide-y divide-line/60 text-xs">
              {open.cols.map(([a, b], i) => (
                <div key={i} className="flex justify-between py-2">
                  <dt className="text-muted">{a}</dt>
                  <dd className="font-bold text-ink">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Modal>
      )}
    </Page>
  );
}

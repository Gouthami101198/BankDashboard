import { useState } from 'react';
import Icon from '../Icons.jsx';
import { useStore } from '../store.jsx';
import { Page, Panel, Tabs, Toggle, Field, ConfettiBurst } from '../components/ui.jsx';
import { initials } from '../utils.js';
import { sounds } from '../audio.js';

const timezones = [
  '(GMT-12:00) International Date Line West',
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-05:00) Eastern Time (US & Canada)',
  '(GMT+00:00) London',
  '(GMT+01:00) Paris',
  '(GMT+05:30) India Standard Time',
  '(GMT+09:00) Tokyo',
];

function EditProfile({ onSaveSuccess }) {
  const { state, dispatch, showToast } = useStore();
  const [form, setForm] = useState(state.profile);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast('Image size should be under 3MB', 'err');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((prev) => ({ ...prev, avatar: event.target.result }));
      showToast('Profile photo selected! Click Save to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = (e) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, avatar: '' }));
    showToast('Photo removed. Click Save to apply.');
  };

  const save = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address';
    if (form.postalCode && !/^[\w -]{3,10}$/.test(form.postalCode)) err.postalCode = 'Enter a valid postal code';
    setErrors(err);
    if (Object.keys(err).length) return;

    dispatch({ type: 'updateProfile', profile: form });
    showToast('✅ Profile saved successfully!');
    if (onSaveSuccess) onSaveSuccess();
  };

  const fields = [
    ['name', 'Full Name'],
    ['username', 'Username'],
    ['email', 'Email Address', 'email'],
    ['password', 'Security Password', 'password'],
    ['dob', 'Date of Birth', 'date'],
    ['presentAddress', 'Present Address'],
    ['permanentAddress', 'Permanent Address'],
    ['city', 'City'],
    ['postalCode', 'Postal Code'],
    ['country', 'Country'],
  ];

  return (
    <form className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start" onSubmit={save} noValidate>
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <label
            htmlFor="avatar-file-input"
            className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-line bg-surface-2 grid place-items-center cursor-pointer shadow-md select-none transition-transform group-hover:scale-105"
            title="Click to change photo"
          >
            {form.avatar ? (
              <img src={form.avatar} alt={form.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold text-ink">{initials(form.name || '?')}</span>
            )}
            <span className="absolute inset-0 bg-black/55 text-white flex flex-col items-center justify-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon name="camera" size={20} />
              <span>Change</span>
            </span>
          </label>
          <label
            htmlFor="avatar-file-input"
            className="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-primary text-white grid place-items-center shadow-md cursor-pointer hover:scale-110 transition-transform active:scale-90"
            title="Change photo"
            tabIndex={0}
          >
            <Icon name="pencil" size={13} />
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        {form.avatar && (
          <button
            type="button"
            className="text-xs font-bold text-neg hover:underline pt-1 cursor-pointer"
            onClick={handleRemoveAvatar}
          >
            Remove Photo
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {fields.map(([k, label, type]) => (
            <Field key={k} id={`p-${k}`} label={label} type={type || 'text'} value={form[k]} onChange={set(k)} error={errors[k]} />
          ))}
        </div>
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="inline-flex justify-center px-10 py-2.5 rounded-xl bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary-dark shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}

function Preferences({ onSaveSuccess }) {
  const { state, dispatch, showToast, theme, setTheme } = useStore();
  const [form, setForm] = useState({ ...state.prefs, theme });

  const save = (e) => {
    e.preventDefault();
    dispatch({ type: 'updatePrefs', prefs: form });
    if (form.theme) setTheme(form.theme);
    showToast('✅ Preferences saved!');
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        <Field id="pref-theme" label="Theme Appearance">
          <select
            id="pref-theme"
            value={form.theme || theme || 'light'}
            onChange={(e) => setForm({ ...form, theme: e.target.value })}
            className="h-10 px-3.5 rounded-xl border border-field bg-surface text-text text-xs md:text-sm outline-none focus:border-primary"
          >
            <option value="light">☀️ Light Modern</option>
            <option value="dark">🌙 Dark Obsidian</option>
          </select>
        </Field>
        <Field id="pref-currency" label="Primary Currency">
          <select
            id="pref-currency"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="h-10 px-3.5 rounded-xl border border-field bg-surface text-text text-xs md:text-sm outline-none focus:border-primary"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </Field>
        <Field id="pref-tz" label="Account Time Zone">
          <select
            id="pref-tz"
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="h-10 px-3.5 rounded-xl border border-field bg-surface text-text text-xs md:text-sm outline-none focus:border-primary"
          >
            {timezones.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-bold text-ink mb-3">Notification Preferences</h4>
        <div className="flex flex-col gap-3.5 bg-surface-2 p-4 rounded-2xl border border-line/60">
          <Toggle
            id="n-digital"
            checked={form.notifyDigital}
            onChange={(v) => setForm({ ...form, notifyDigital: v })}
            label="Instant alert on incoming / outgoing digital currency transfers"
          />
          <Toggle
            id="n-merchant"
            checked={form.notifyMerchant}
            onChange={(v) => setForm({ ...form, notifyMerchant: v })}
            label="Merchant and card transaction confirmation notifications"
          />
          <Toggle
            id="n-reco"
            checked={form.notifyRecommendations}
            onChange={(v) => setForm({ ...form, notifyRecommendations: v })}
            label="AI insights &amp; privilege cashback recommendations"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex justify-center px-10 py-2.5 rounded-xl bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary-dark shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </form>
  );
}

function Security({ onSaveSuccess }) {
  const { state, dispatch, showToast } = useStore();
  const [pw, setPw] = useState({ current: '', next: '' });
  const [errors, setErrors] = useState({});

  const save = (e) => {
    e.preventDefault();
    const err = {};
    if (!pw.current) err.current = 'Enter your current password';
    if (pw.next.length < 8) err.next = 'Password must be at least 8 characters';
    setErrors(err);
    if (Object.keys(err).length) return;

    setPw({ current: '', next: '' });
    showToast('🔒 Security password changed successfully!');
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-6">
      <div className="bg-surface-2 p-4 rounded-2xl border border-line/60">
        <h4 className="text-sm font-bold text-ink mb-1">Two-factor Authentication (2FA)</h4>
        <p className="text-xs text-muted mb-3">Add a biometric or authenticator security layer to all wire transfers.</p>
        <Toggle
          id="s-2fa"
          checked={state.prefs.twoFactor}
          label="Require 2FA verification for wire transfers &amp; new devices"
          onChange={(v) => {
            dispatch({ type: 'updatePrefs', prefs: { twoFactor: v } });
            showToast(v ? '🛡️ Two-factor authentication enabled!' : '⚠️ Two-factor disabled');
          }}
        />
      </div>

      <div className="pt-1">
        <h4 className="text-sm font-bold text-ink mb-3">Update Master Password</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <Field
            id="s-current"
            label="Current Password"
            type="password"
            value={pw.current}
            error={errors.current}
            onChange={(e) => setPw({ ...pw, current: e.target.value })}
          />
          <Field
            id="s-new"
            label="New Password"
            type="password"
            value={pw.next}
            error={errors.next}
            onChange={(e) => setPw({ ...pw, next: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex justify-center px-10 py-2.5 rounded-xl bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary-dark shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Save Password
        </button>
      </div>
    </form>
  );
}

export default function Settings() {
  const { dispatch, showToast } = useStore();
  const [tab, setTab] = useState('profile');
  const [confetti, setConfetti] = useState(false);

  const triggerCelebration = () => {
    sounds.success();
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2000);
  };

  return (
    <Page>
      <ConfettiBurst active={confetti} />
      <Panel className="p-5 md:p-7">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { key: 'profile', label: 'Edit Profile' },
            { key: 'prefs', label: 'Preferences' },
            { key: 'security', label: 'Security & 2FA' },
          ]}
        />
        <div className="pt-6">
          {tab === 'profile' && <EditProfile onSaveSuccess={triggerCelebration} />}
          {tab === 'prefs' && <Preferences onSaveSuccess={triggerCelebration} />}
          {tab === 'security' && <Security onSaveSuccess={triggerCelebration} />}
        </div>
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-line text-xs">
          <span className="text-muted">BankDash Core v2.4 • 256-bit AES Protected</span>
          <button
            className="text-muted hover:text-neg transition-colors hover:underline cursor-pointer"
            onClick={() => {
              dispatch({ type: 'reset' });
              showToast('Demo data reset to initial values');
              setTab('profile');
            }}
          >
            Reset demo data
          </button>
        </div>
      </Panel>
    </Page>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Sidebar, Header } from './components/Layout.jsx';
import { Toast } from './components/ui.jsx';
import { navItems } from './data.js';
import { StoreProvider } from './store.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Accounts from './pages/Accounts.jsx';
import Investments from './pages/Investments.jsx';
import CreditCards from './pages/CreditCards.jsx';
import Loans from './pages/Loans.jsx';
import Services from './pages/Services.jsx';
import Privileges from './pages/Privileges.jsx';
import Settings from './pages/Settings.jsx';

const pages = {
  dashboard: Dashboard,
  transactions: Transactions,
  accounts: Accounts,
  investments: Investments,
  cards: CreditCards,
  loans: Loans,
  services: Services,
  privileges: Privileges,
  settings: Settings,
};

// Hash routing (#transactions, #cards, ...) keeps the app a single static page.
const readHash = () => {
  const key = window.location.hash.replace('#', '');
  return pages[key] ? key : 'dashboard';
};

export default function App() {
  const [page, setPage] = useState(readHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const onHash = () => {
      setPage(readHash());
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const item = navItems.find((n) => n.key === page) || navItems[0];
  const title = item.title || item.label;
  const Page = pages[page];

  return (
    <StoreProvider>
      <div className="flex h-screen h-dvh w-full bg-bg text-text antialiased selection:bg-primary-soft selection:text-primary overflow-hidden">
        <Sidebar active={page} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="flex-1 flex flex-col h-full min-w-0 md:ml-[220px] overflow-hidden transition-all">
          <Header title={title} onMenu={() => setMenuOpen(true)} />
          <div
            ref={contentRef}
            id="slide-content-section"
            tabIndex={-1}
            className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 focus:outline-none scroll-smooth"
          >
            <div key={page} className="animate-slide-up pb-8">
              <Page />
            </div>
          </div>
        </div>
        <Toast />
      </div>
    </StoreProvider>
  );
}

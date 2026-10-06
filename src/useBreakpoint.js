import { useEffect, useState } from 'react';

// Breakpoints match the three Figma frames:
//   desktop ≥ 1280px (designed at 1440) · tab 768–1279px (designed at 1024) · mobile ≤ 767px (designed at 375)
export const BREAKPOINTS = { mobileMax: 767, tabMax: 1279 };

const read = () => {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w <= BREAKPOINTS.mobileMax) return 'mobile';
  if (w <= BREAKPOINTS.tabMax) return 'tab';
  return 'desktop';
};

export function useBreakpoint() {
  const [bp, setBp] = useState(read);
  useEffect(() => {
    const onResize = () => setBp(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return bp;
}

// pick(bp, desktopValue, tabValue, mobileValue)
export const pick = (bp, desktop, tab, mobile = tab) => (bp === 'mobile' ? mobile : bp === 'tab' ? tab : desktop);

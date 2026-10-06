import { useStore } from './store.jsx';
import {
  colors, darkColors,
  tones, darkTones,
  chart, darkChart,
  tooltipProps, darkTooltipProps
} from './theme.js';

export function useChartTheme() {
  const store = useStore();
  const isDark = store?.theme === 'dark';
  return {
    isDark,
    colors: isDark ? darkColors : colors,
    tones: isDark ? darkTones : tones,
    chart: isDark ? darkChart : chart,
    tooltipProps: isDark ? darkTooltipProps : tooltipProps,
    axisTick: isDark ? darkChart.tick : chart.tick,
  };
}

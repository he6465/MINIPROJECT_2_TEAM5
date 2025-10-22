import '@testing-library/jest-dom/vitest';

// Recharts ResponsiveContainer 등에서 사용되는 ResizeObserver 폴리필
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error test env polyfill
global.ResizeObserver = RO;



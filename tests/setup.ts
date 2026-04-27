import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() { return null; }
  observe() { return null; }
  takeRecords() { return []; }
  unobserve() { return null; }
};

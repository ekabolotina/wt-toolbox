import 'fake-indexeddb/auto';

// Unit tests cover the fallback without Web Locks, as in the original jsdom suite
// Real extension browser checks exercise Chrome's Web Locks implementation
Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });

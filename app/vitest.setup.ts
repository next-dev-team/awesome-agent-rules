import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  // 清理DOM
  cleanup();
});

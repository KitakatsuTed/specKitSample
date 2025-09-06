import '@testing-library/jest-dom';

// Setup localStorage mock for tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Reset localStorage mock before each test
beforeEach(async () => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  localStorageMock.key.mockClear();

  // Clear all tasks before each test
  localStorageMock.getItem.mockReturnValue(null);

  // Reset TaskService state if it exists
  try {
    const { clearAllTasks } = await import('@/services/TaskService');
    clearAllTasks();
  } catch {
    // TaskService may not exist yet during initial runs
  }
});

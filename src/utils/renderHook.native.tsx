import { render } from '@testing-library/react-native';
import React from 'react';

export function renderHook<T>(hook: () => T) {
  const result: { current: T | null } = { current: null };

  function TestComponent() {
    result.current = hook();
    return null;
  }

  render(<TestComponent />);

  return { result };
}

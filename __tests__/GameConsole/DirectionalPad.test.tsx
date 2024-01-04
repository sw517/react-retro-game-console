import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import DirectionalPad from '@/app/ui/GameConsole/DirectionalPad';

test('Page', () => {
  render(<DirectionalPad />);
  expect(screen.getByTestId('directional-pad')).toBeDefined();
});

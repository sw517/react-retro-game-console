import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import DirectionalPadImage from '@/app/ui/GameConsole/DirectionalPadImage';

test('Page', () => {
  render(<DirectionalPadImage />);
  expect(screen.getByTestId('directional-pad')).toBeDefined();
});

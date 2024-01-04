import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import RoundButton from '@/app/ui/GameConsole/RoundButton';

test('RoundButton', () => {
  render(<RoundButton letter="A" />);
  expect(screen.getByTestId('button')).toBeDefined();
});

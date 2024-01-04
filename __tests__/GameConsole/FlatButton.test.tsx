import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import FlatButton from '@/app/ui/GameConsole/FlatButton';

test('FlatButton', () => {
  render(<FlatButton label="A" />);
  expect(screen.getByTestId('button')).toBeDefined();
});

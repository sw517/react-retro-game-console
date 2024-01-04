import { test, vi } from 'vitest';
import { render } from '@testing-library/react';
import Page from '../src/app/page';

test('Page', () => {
  vi.mock('next/font/google', () => ({
    Ubuntu: () => ({
      style: {
        fontFamily: 'mocked',
      },
    }),
  }));

  render(<Page />);
});

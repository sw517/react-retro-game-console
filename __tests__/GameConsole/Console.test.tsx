import { expect, it, vi, describe, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Console from '@/app/ui/GameConsole/Console';

describe('Console', () => {
  beforeEach(() => {
    vi.mock('next/font/google', () => ({
      Ubuntu: () => ({
        style: {
          fontFamily: 'mocked',
        },
      }),
      Grandstander: () => ({
        style: {
          fontFamily: 'mocked',
        },
      }),
    }));
  });

  it('renders a DirectionalPad', () => {
    const { unmount } = render(<Console />);
    expect(screen.getByTestId('directional-pad-button')).toBeDefined();
    unmount();
  });

  it('renders an A button', () => {
    const { unmount } = render(<Console />);
    expect(screen.getByTestId('a-button')).toBeDefined();
    unmount();
  });

  it('renders a B button', () => {
    const { unmount } = render(<Console />);
    expect(screen.getByTestId('b-button')).toBeDefined();
    unmount();
  });

  it('renders a Select button', () => {
    const { unmount } = render(<Console />);
    expect(screen.getByTestId('select-button')).toBeDefined();
    unmount();
  });

  it('renders a Start button', () => {
    const { unmount } = render(<Console />);
    expect(screen.getByTestId('start-button')).toBeDefined();
    unmount();
  });

  it('renders a power LED', () => {
    const { unmount } = render(<Console />);
    expect(screen.getByTestId('power-led')).toBeDefined();
    unmount();
  });

  it('powers Console on when Start button is pressed', async () => {
    const { unmount } = render(<Console />);

    expect(screen.getByTestId('power-led').getAttribute('data-status')).toBe(
      'off'
    );
    const startButton = screen.getByTestId('start-button');
    await fireEvent.touchStart(startButton);

    expect(screen.getByTestId('power-led').getAttribute('data-status')).toBe(
      'on'
    );
    unmount();
  });
});

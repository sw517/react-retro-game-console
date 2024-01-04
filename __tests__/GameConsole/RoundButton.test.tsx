import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RoundButton from '@/app/ui/GameConsole/RoundButton';

describe('RoundButton', () => {
  it('renders a button', () => {
    const mockFunction = vi.fn();
    const { unmount } = render(
      <RoundButton pressed={false} onPress={mockFunction} letter="A" />
    );
    const buttonElement = screen.getByTestId('round-button');
    expect(buttonElement).toBeDefined();
    unmount();
  });

  it('calls onPress when touchStart is fired', async () => {
    const mockFunction = vi.fn();
    const { unmount } = render(
      <RoundButton pressed={false} onPress={mockFunction} letter="A" />
    );
    const buttonElement = screen.getByTestId('round-button');
    expect(buttonElement).toBeDefined();
    await fireEvent.touchStart(buttonElement);
    expect(mockFunction).toHaveBeenCalledWith(true);
    unmount();
  });
});

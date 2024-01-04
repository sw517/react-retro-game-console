import { expect, it, vi, describe } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FlatButton from '@/app/ui/GameConsole/FlatButton';

describe('FlatButton', () => {
  it('renders a button', () => {
    const mockFunction = vi.fn();
    const { unmount } = render(
      <FlatButton pressed={false} onPress={mockFunction} label="A" />
    );
    const buttonElement = screen.getByTestId('flat-button');
    expect(buttonElement).toBeDefined();
    unmount();
  });

  it('calls onPress when touchStart is fired', async () => {
    const mockFunction = vi.fn();
    const { unmount } = render(
      <FlatButton pressed={false} onPress={mockFunction} label="A" />
    );
    const buttonElement = screen.getByTestId('flat-button');
    expect(buttonElement).toBeDefined();
    await fireEvent.touchStart(buttonElement);
    expect(mockFunction).toHaveBeenCalledWith(true);
    unmount();
  });
});

import styles from '@/app/ui/GameConsole/styles.module.scss';
import clsx from 'clsx';
import { TouchEvent, MouseEvent } from 'react';

export default function Button({
  letter,
  className,
  onPress,
  pressed,
  dataTestId = 'round-button',
}: {
  pressed: boolean;
  onPress: (arg0: boolean) => void;
  letter: string;
  className?: string;
  dataTestId?: string;
}) {
  const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPress(true);
  };
  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPress(true);
  };
  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPress(false);
  };
  const handleMouseUp = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPress(false);
  };

  return (
    <button
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={clsx([
        className,
        styles['round-button'],
        pressed && styles['round-button--pressed'],
      ])}
      data-testid={dataTestId}
    >
      {letter}
    </button>
  );
}

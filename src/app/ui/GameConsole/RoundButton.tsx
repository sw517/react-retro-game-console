import styles from '@/app/ui/GameConsole/styles.module.scss';
import clsx from 'clsx';
import { TouchEvent } from 'react';

export default function Button({
  letter,
  className,
  onPress,
  pressed,
}: {
  pressed: boolean;
  onPress: (arg0: boolean) => void;
  letter: string;
  className?: string;
}) {
  const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
    onPress(true);
  };
  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    onPress(false);
  };

  return (
    <button
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={clsx([
        className,
        styles['round-button'],
        pressed && styles['round-button--pressed'],
      ])}
      data-testid="round-button"
    >
      {letter}
    </button>
  );
}

import styles from '@/app/ui/GameConsole/styles.module.scss';
import clsx from 'clsx';
import { TouchEvent, MouseEvent } from 'react';

export default function FlatButton({
  onPress,
  pressed,
  label,
  className,
  dataTestId = 'flat-button',
}: {
  label: string;
  onPress: (arg0: boolean) => void;
  pressed: boolean;
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
    <div className={clsx([className, 'inline-block text-center'])}>
      <button
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className={clsx([
          styles['flat-button'],
          pressed && styles['flat-button--pressed'],
        ])}
        data-testid={dataTestId}
        aria-label={label}
      />
      <span
        className={`${styles['flat-button-label']} text-xs text-white opacity-25 font-bold`}
        aria-hidden
      >
        {label}
      </span>
    </div>
  );
}

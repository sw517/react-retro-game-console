import styles from '@/app/ui/GameConsole/styles.module.scss';
import clsx from 'clsx';
import { TouchEvent } from 'react';

export default function FlatButton({
  onPress,
  pressed,
  label,
  className,
}: {
  label: string;
  onPress: (arg0: boolean) => void;
  pressed: boolean;
  className?: string;
}) {
  const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
    onPress(true);
  };
  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    onPress(false);
  };

  return (
    <div className={clsx([className, 'inline-block text-center'])}>
      <button
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={clsx([
          styles['flat-button'],
          pressed && styles['flat-button--pressed'],
        ])}
        aria-label={label}
      />
      <span className={styles['flat-button-label']} aria-hidden>
        {label}
      </span>
    </div>
  );
}

import { TouchEvent, MouseEvent, useState, useContext } from 'react';
import { SettingsContext } from '@/app/contexts/SettingsContext';
import { SettingsKeys } from '@/types/settings';
import styles from '@/app/ui/GameConsole/styles.module.scss';
import clsx from 'clsx';
import useNavigator from '@/app/hooks/useNavigator';
import { Button as ButtonType } from '@/types/input';

export default function Button({
  value,
  className,
  onPress,
  type = 'round',
  dataTestId = 'round-button',
}: {
  onPress: (arg0: ButtonType | null) => void;
  value: ButtonType;
  className?: string;
  type?: 'round' | 'flat';
  dataTestId?: string;
}) {
  const settings = useContext(SettingsContext);
  const { vibrate } = useNavigator();
  const [pressed, setPressed] = useState(false);

  const handlePress = (
    e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (settings[SettingsKeys.VIBRATION_ENABLED]) {
      vibrate();
    }
    setPressed(true);
    onPress(value);
  };
  const handleRelease = (
    e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setPressed(false);
    onPress(null);
  };

  if (type === 'round') {
    return (
      <button
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        className={clsx([
          className,
          styles['round-button'],
          pressed && styles['round-button--pressed'],
        ])}
        data-testid={dataTestId}
      >
        {value}
      </button>
    );
  } else {
    return (
      <div className={clsx([className, 'inline-block text-center'])}>
        <button
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          className={clsx([
            styles['flat-button'],
            pressed && styles['flat-button--pressed'],
          ])}
          data-testid={dataTestId}
        />
        <span
          className={`${styles['flat-button-label']} text-xs text-white opacity-25 font-bold`}
          aria-hidden
        >
          {value}
        </span>
      </div>
    );
  }
}

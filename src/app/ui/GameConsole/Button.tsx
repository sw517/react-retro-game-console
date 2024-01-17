import {
  TouchEvent,
  MouseEvent,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { SettingsContext } from '@/app/contexts/SettingsContext';
import { SettingsKeys } from '@/types/settings';
import styles from '@/app/ui/GameConsole/styles.module.scss';
import clsx from 'clsx';
import useNavigator from '@/app/hooks/useNavigator';
import { Button as ButtonType } from '@/types/input';

export default function Button({
  value,
  keyboardCode,
  className,
  type = 'round',
  dataTestId = 'round-button',
}: {
  value: ButtonType;
  keyboardCode: KeyboardEvent['code'] | KeyboardEvent['code'][];
  className?: string;
  type?: 'round' | 'flat';
  dataTestId?: string;
}) {
  const settings = useContext(SettingsContext);
  const { vibrate } = useNavigator();
  const [pressed, setPressed] = useState(false);

  const handleButtonPress = useCallback(
    (pressed: boolean) => {
      setPressed(pressed);
      window.emitter.emit('input', pressed ? value : null);
      if (pressed && settings[SettingsKeys.VIBRATION_ENABLED]) {
        vibrate();
      }
    },
    [settings, vibrate, value]
  );

  const onButtonPress = (
    e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    handleButtonPress(true);
  };
  const onButtonRelease = (
    e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    handleButtonPress(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      if (
        (typeof keyboardCode === 'string' && keyboardCode === e.code) ||
        keyboardCode.includes(e.code)
      ) {
        handleButtonPress(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === keyboardCode) {
        handleButtonPress(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleButtonPress, keyboardCode]);

  if (type === 'round') {
    return (
      <button
        onTouchStart={onButtonPress}
        onTouchEnd={onButtonRelease}
        onMouseDown={onButtonPress}
        onMouseUp={onButtonRelease}
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
          onTouchStart={onButtonPress}
          onTouchEnd={onButtonRelease}
          onMouseDown={onButtonPress}
          onMouseUp={onButtonRelease}
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

'use client';

import {
  MouseEvent,
  TouchEvent,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { SettingsContext } from '@/app/contexts/SettingsContext';
import { SettingsKeys } from '@/types/settings';
import { Direction } from '@/types/input';
import isTouchEvent from '@/app/helpers/is-touch-event';
import useNavigator from '@/app/hooks/useNavigator';
import styles from '@/app/ui/GameConsole/styles.module.scss';
import DirectionalPadImage from './DirectionalPadImage';

export default function DirectionalPad({
  dataTestId,
}: {
  dataTestId?: string;
}) {
  const settings = useContext(SettingsContext);
  const { vibrate } = useNavigator();

  const [directionPressed, setDirectionPressed] = useState<Direction | null>(
    null
  );

  const handleDirectionPressed = useCallback(
    (direction: Direction | null) => {
      setDirectionPressed(direction);
      window.emitter.emit('input', direction);
      if (direction && settings[SettingsKeys.VIBRATION_ENABLED]) vibrate();
    },
    [settings, vibrate]
  );

  const calculatePressDirection = (
    e: TouchEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    let touchX, touchY: number;

    if (isTouchEvent(e)) {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    } else {
      touchX = e.clientX;
      touchY = e.clientY;
    }

    const relativeX = touchX - buttonRect.left;
    const relativeY = touchY - buttonRect.top;

    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;

    const isWithinHorizontalCenter =
      relativeX > buttonWidth / 3 && relativeX < (2 * buttonWidth) / 3;
    const isWithinVerticalCenter =
      relativeY > buttonHeight / 3 && relativeY < (2 * buttonHeight) / 3;

    if (isWithinHorizontalCenter && relativeY < buttonHeight / 3) {
      return Direction.UP;
    } else if (isWithinHorizontalCenter && relativeY > (2 * buttonHeight) / 3) {
      return Direction.DOWN;
    } else if (isWithinVerticalCenter && relativeX < buttonWidth / 3) {
      return Direction.LEFT;
    } else if (isWithinVerticalCenter && relativeX > (2 * buttonWidth) / 3) {
      return Direction.RIGHT;
    }
  };

  const onDirectionPress = (
    e: TouchEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const direction = calculatePressDirection(e) || null;
    handleDirectionPressed(direction);
  };

  const onTouchMove = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const direction = calculatePressDirection(e) || null;
    if (direction === directionPressed) return;

    handleDirectionPressed(direction);
  };

  const onDirectionRelease = (
    e: TouchEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    handleDirectionPressed(null);
  };

  const onMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.buttons) {
      const direction = calculatePressDirection(e) || null;
      if (direction === directionPressed) return;

      handleDirectionPressed(direction);
    }
  };

  const handleContextMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          handleDirectionPressed(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'KeyD':
          handleDirectionPressed(Direction.RIGHT);
          break;
        case 'ArrowUp':
        case 'KeyW':
          handleDirectionPressed(Direction.UP);
          break;
        case 'ArrowDown':
        case 'KeyS':
          handleDirectionPressed(Direction.DOWN);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let directionReleased;
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          directionReleased = Direction.LEFT;
          break;
        case 'ArrowRight':
        case 'KeyD':
          directionReleased = Direction.RIGHT;
          break;
        case 'ArrowUp':
        case 'KeyW':
          directionReleased = Direction.UP;
          break;
        case 'ArrowDown':
        case 'KeyS':
          directionReleased = Direction.DOWN;
          break;
        default:
          break;
      }

      if (directionReleased === directionPressed) {
        handleDirectionPressed(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleDirectionPressed, directionPressed]);

  return (
    <button
      onMouseDown={onDirectionPress}
      onMouseUp={onDirectionRelease}
      onMouseMove={onMouseMove}
      onTouchStart={onDirectionPress}
      onTouchMove={onTouchMove}
      onTouchEnd={onDirectionRelease}
      onContextMenu={handleContextMenu}
      className={styles['d-pad']}
      data-testid={dataTestId}
    >
      <DirectionalPadImage directionPressed={directionPressed} />
    </button>
  );
}

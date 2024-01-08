'use client';

import styles from '@/app/ui/GameConsole/styles.module.scss';
import DirectionalPadImage from './DirectionalPadImage';
import { MouseEvent, TouchEvent } from 'react';
import { Direction } from '@/types/direction';
import isTouchEvent from '@/app/helpers/is-touch-event';

export default function DirectionalPad({
  directionPressed,
  onPress,
  dataTestId,
}: {
  onPress: (arg0: Direction | null) => void;
  directionPressed: Direction | null;
  dataTestId?: string;
}) {
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

  const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const direction = calculatePressDirection(e) || null;
    onPress(direction);
  };

  const handleTouchMove = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const direction = calculatePressDirection(e) || null;
    onPress(direction);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPress(null);
  };

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const direction = calculatePressDirection(e) || null;
    onPress(direction);
  };

  const handleMouseUp = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPress(null);
  };

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.buttons) {
      const direction = calculatePressDirection(e) || null;
      onPress(direction);
    }
  };

  const handleContextMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      className={styles['d-pad']}
      data-testid={dataTestId}
    >
      <DirectionalPadImage directionPressed={directionPressed} />
    </button>
  );
}

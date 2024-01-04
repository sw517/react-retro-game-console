'use client';

import styles from '@/app/ui/GameConsole/styles.module.scss';
import DirectionalPadImage from './DirectionalPadImage';
import { MouseEvent, TouchEvent } from 'react';
import { Direction } from '@/types/direction';

export default function DirectionalPad({
  directionPressed,
  onPress,
}: {
  onPress: (arg0: Direction | null) => void;
  directionPressed: Direction | null;
}) {
  const calculatePressDirection = (e: TouchEvent<HTMLButtonElement>) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

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
    const direction = calculatePressDirection(e) || null;
    onPress(direction);
  };

  const handleTouchMove = (e: TouchEvent<HTMLButtonElement>) => {
    const direction = calculatePressDirection(e) || null;
    onPress(direction);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    onPress(null);
  };

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleContextMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      className={styles['d-pad']}
    >
      <DirectionalPadImage directionPressed={directionPressed} />
    </button>
  );
}

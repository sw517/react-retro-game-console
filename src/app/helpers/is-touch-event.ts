import { MouseEvent, TouchEvent } from 'react';

export default function isTouchEvent(
  e: MouseEvent | TouchEvent
): e is TouchEvent {
  return ['touchstart', 'touchmove', 'touchend'].includes(e.type);
}

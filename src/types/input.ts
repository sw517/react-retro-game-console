import { Handler } from 'mitt';

export enum Direction {
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LEFT = 'left',
}

export enum Button {
  A = 'a',
  B = 'b',
  SELECT = 'select',
  START = 'start',
}

export type InputValue = Direction | Button;

// type Emits<EventType extends string, T> = {
//   on(type: EventType, handler: (arg: T) => void): void;
//   off(type: EventType, handler: (arg: T) => void): void;
//   emit(type: EventType, arg: T): void;
// };

// export type Emitter = Emits<'a', { a: number }> & Emits<'b', { b: string }>;

export type InputEvent = {
  input: InputValue;
};

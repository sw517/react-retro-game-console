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

export type Ball = {
  diameter: number;
  xPos: number;
  yPos: number;
  dx: number;
  dy: number;
};

export type Paddle = {
  xPos: number;
  // yPos: number;
  width: number;
  height: number;
};

export type Brick = { status: 0 | 1; x: number; y: number };

type BrickColumn = Brick[];

export type Bricks = {
  columns: number;
  rows: number;
  width: number;
  height: number;
  padding: number;
  xOffset: number;
  yOffset: number;
  points: number;
  instances: BrickColumn[];
};

export type Canvas = {
  width: number;
  height: number;
  color: string;
  background: string;
};

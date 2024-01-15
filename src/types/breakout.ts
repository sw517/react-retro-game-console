export type Ball = {
  diameter: number;
  xPos: number;
  yPos: number;
  dx: number;
  dy: number;
  fill: string;
  speed: number;
};

export type Paddle = {
  xPos: number;
  width: number;
  height: number;
};

export type Brick = { status: 0 | 1; x: number; y: number };

export type BrickColumn = Brick[];

export type BrickInstances = BrickColumn[];

export type BrickConfig = {
  columns: number;
  rows: number;
  height: number;
  padding: number;
  xOffset: number;
  yOffset: number;
  points: number;
};

export type Canvas = {
  width: number;
  height: number;
  color: string;
  background: string;
};

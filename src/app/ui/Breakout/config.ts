import { Ball, BrickConfig } from '@/types/breakout';

const brickConfigs = [
  {
    columns: 4,
    rows: 3,
    points: 10,
  },
  {
    columns: 5,
    rows: 3,
    points: 20,
  },
  {
    columns: 6,
    rows: 4,
    points: 30,
  },
  {
    columns: 7,
    rows: 3,
    points: 40,
  },
  {
    columns: 7,
    rows: 3,
    points: 50,
  },
];

export const getBrickConfig = (level = 0): BrickConfig => {
  return {
    height: 5,
    padding: 8,
    xOffset: 12,
    yOffset: 20,
    ...(brickConfigs[level - 0] || brickConfigs[0]),
  };
};

const ballConfigs = [
  { fill: '#ccc', speed: 1 },
  { fill: '#84edd8', speed: 1.25 },
  { fill: '#b6ae48', speed: 1.5 },
  { fill: '#a848b6', speed: 1.75 },
  { fill: '#59b648', speed: 2 },
];

export const getBallConfig = (level = 0): Ball => {
  return {
    xPos: 0,
    yPos: 0,
    dy: 0,
    dx: 0,
    diameter: 3,
    ...(ballConfigs[level] || ballConfigs[0]),
  };
};

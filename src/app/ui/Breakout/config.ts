import { Ball, BrickConfig, ColorConfig } from '@/types/breakout';

const colorConfigs: ColorConfig[] = [
  {
    background: '#333',
    text: '#ccc',
    ball: '#ccc',
    paddle: '#ccc',
    brick: '#ccc',
  },
  {
    background: '#333',
    text: '#ccc',
    ball: '#ccc',
    paddle: '#ccc',
    brick: '#b6ae48',
  },
  {
    background: '#333',
    text: '#ccc',
    ball: '#ccc',
    paddle: '#ccc',
    brick: '#f088ff',
  },
  {
    background: '#333',
    text: '#ccc',
    ball: '#ccc',
    paddle: '#ccc',
    brick: '#84edd8',
  },
  {
    background: '#ccc',
    text: '#333',
    ball: '#333',
    paddle: '#333',
    brick: '#333',
  },
];

export const getColorConfig = (level = 0): ColorConfig => {
  return colorConfigs[level] || colorConfigs[0];
};

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
    rows: 4,
    points: 40,
  },
  {
    columns: 7,
    rows: 4,
    points: 50,
  },
];

export const getBrickConfig = (level = 0): BrickConfig => {
  return {
    height: 6,
    padding: 8,
    xOffset: 12,
    yOffset: 20,
    ...(brickConfigs[level - 0] || brickConfigs[0]),
  };
};

const ballConfigs = [
  { speed: 1 },
  { speed: 1.25 },
  { speed: 1.5 },
  { speed: 2 },
  { speed: 3 },
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

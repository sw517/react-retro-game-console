'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Direction } from '@/types/direction';
import styles from './styles.module.scss';
import { type Paddle, Ball, Bricks, Canvas } from '@/types/breakout';

const initialCanvas: Canvas = {
  width: 0,
  height: 0,
  color: '#ccc',
  background: '#333333',
};
const initialBall: Ball = { xPos: 0, yPos: 0, dy: 0, dx: 0, diameter: 4 };
const initialPaddle: Paddle = { xPos: 0, width: 40, height: 6 };
const initialBricks: Bricks = {
  columns: 5,
  rows: 3,
  width: 20,
  height: 8,
  padding: 8,
  xOffset: 12,
  yOffset: 12,
  points: 10,
  instances: [],
};

export default function Breakout({
  directionPressed,
  startPressed,
}: {
  directionPressed: Direction | null;
  startPressed: boolean;
}) {
  const dpr = useRef(1);
  const animationInterval = useRef<number | undefined>();
  const canvas = useRef<Canvas>(initialCanvas);
  const [canvasPixelWidth, setCanvasPixelWidth] = useState<number>(
    canvas.current.width * dpr.current
  );
  const [canvasPixelHeight, setCanvasPixelHeight] = useState<number>(
    canvas.current.height * dpr.current
  );
  const canvasElement = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef(canvasElement.current?.getContext('2d'));
  const ball = useRef<Ball>(initialBall);
  const paddle = useRef<Paddle>(initialPaddle);
  const bricks = useRef<Bricks>(initialBricks);

  const getParentContainerWidth = () => {
    if (!canvasElement.current?.parentElement) return 0;

    const styles = window.getComputedStyle(canvasElement.current.parentElement);

    const paddingLeft = Number(
      styles.getPropertyValue('padding-left').replace('px', '')
    );
    const paddingRight = Number(
      styles.getPropertyValue('padding-right').replace('px', '')
    );
    const width = Number(styles.getPropertyValue('width').replace('px', ''));
    return width - paddingLeft - paddingRight;
  };

  const getParentContainerHeight = () => {
    if (!canvasElement.current?.parentElement) return 0;

    const styles = window.getComputedStyle(canvasElement.current.parentElement);

    const paddingTop = Number(
      styles.getPropertyValue('padding-top').replace('px', '')
    );
    const paddingBottom = Number(
      styles.getPropertyValue('padding-bottom').replace('px', '')
    );
    const height = Number(styles.getPropertyValue('height').replace('px', ''));
    return height - paddingTop - paddingBottom;
  };

  const initGameProperties = useCallback(() => {
    ctx.current = canvasElement.current?.getContext('2d');

    if (!ctx.current) return;

    canvas.current.width = getParentContainerWidth();
    canvas.current.height = getParentContainerHeight();

    ctx.current.setTransform(1, 0, 0, 1, 0, 0); // Prevent context.scale doubling when reset
    ctx.current.scale(dpr.current, dpr.current); // Scale the drawings to match the dimensions of the canvas
    console.log(ctx.current);

    // Init ball
    ball.current.xPos = canvas.current.width / 2;
    ball.current.yPos = canvas.current.height / 2;

    // Init paddle
    paddle.current.xPos = (canvas.current.width - paddle.current.width) / 2;

    // Init bricks
    const brickWidth =
      (canvas.current.width -
        bricks.current.xOffset * 2 -
        bricks.current.padding * 4) /
      5;
    bricks.current.width = brickWidth;
    for (let c = 0; c < bricks.current.columns; c += 1) {
      bricks.current.instances[c] = [];
      for (let r = 0; r < bricks.current.rows; r += 1) {
        bricks.current.instances[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }, [paddle, ball, ctx, canvas]);

  const draw = useCallback(() => {
    if (!ctx.current) return;

    const getBallSpeed = () => {
      return Math.abs(ball.current.dx);
    };

    const changeBallSpeed = (speed: number) => {
      ball.current.dx = ball.current.dx < 0 ? -speed : speed;
      ball.current.dy = ball.current.dy < 0 ? -speed : speed;
    };

    // Check if ball hits left or right side of canvas.
    // Seperate conditionals used with Math.abs instead of simply
    // toggling this.ball.dx because the ball can get stuck to the edge
    // of the screen when the xPos overlaps the screen edge.
    const checkBoundaries = () => {
      if (ball.current.xPos < ball.current.diameter) {
        ball.current.dx = Math.abs(ball.current.dx);
      } else if (
        ball.current.xPos >
        canvas.current.width - ball.current.diameter
      ) {
        ball.current.dx = -Math.abs(ball.current.dx);
      }
      // Check if ball hits top of canvas.
      if (ball.current.yPos < ball.current.diameter) {
        ball.current.dy = -ball.current.dy;
        // Check if ball hits paddle.
      } else if (
        ball.current.yPos >
          canvas.current.height -
            ball.current.diameter -
            paddle.current.height &&
        ball.current.yPos < canvas.current.height - ball.current.diameter
      ) {
        // Check if ball is between the sides of the paddle.
        if (
          ball.current.xPos > paddle.current.xPos &&
          ball.current.xPos < paddle.current.xPos + paddle.current.width
        ) {
          // Ensure the ball goes only upwards because the ball
          // can sometimes overlap the paddle and get caught inside it.
          ball.current.dy = -Math.abs(ball.current.dy);

          // Make ball go left if hits the left side of the paddle, else
          // make the ball go right.
          if (
            ball.current.xPos <
            paddle.current.xPos + paddle.current.width / 2
          ) {
            ball.current.dx = -Math.abs(ball.current.dx);
          } else {
            ball.current.dx = Math.abs(ball.current.dx);
          }
        }
        // Check if ball hits bottom of canvas.
      } else if (
        ball.current.yPos >
        canvas.current.height - ball.current.diameter
      ) {
        // gameOver();
      }
    };

    const movePaddle = () => {
      if (directionPressed === Direction.RIGHT) {
        if (paddle.current.xPos + paddle.current.width < canvas.current.width) {
          paddle.current.xPos += 7;
        }
      } else if (directionPressed === Direction.LEFT) {
        if (paddle.current.xPos >= 0) {
          paddle.current.xPos -= 7;
        }
      }
    };

    const drawBall = () => {
      if (!ctx.current) return;

      ctx.current.beginPath();
      ctx.current.arc(
        ball.current.xPos,
        ball.current.yPos,
        ball.current.diameter,
        0,
        Math.PI * 2
      );
      ctx.current.fillStyle = 'yellow';
      ctx.current.fill();
      ctx.current.closePath();
      ball.current.xPos += ball.current.dx;
      ball.current.yPos += ball.current.dy;
      checkBoundaries();
    };

    const drawPaddle = () => {
      if (!ctx.current) return;

      ctx.current.beginPath();
      ctx.current.rect(
        paddle.current.xPos,
        canvas.current.height - paddle.current.height,
        paddle.current.width,
        paddle.current.height
      );
      ctx.current.fillStyle = 'pink';
      ctx.current.fill();
      ctx.current.closePath();
    };

    const drawBricks = () => {
      if (!ctx.current) return;

      for (let c = 0; c < bricks.current.columns; c += 1) {
        for (let r = 0; r < bricks.current.rows; r += 1) {
          if (bricks.current.instances[c][r].status === 1) {
            const brickXPos =
              c * (bricks.current.width + bricks.current.padding) +
              bricks.current.xOffset;
            const brickYPos =
              r * (bricks.current.height + bricks.current.padding) +
              bricks.current.yOffset;
            bricks.current.instances[c][r].x = brickXPos;
            bricks.current.instances[c][r].y = brickYPos;
            ctx.current.beginPath();
            ctx.current.rect(
              brickXPos,
              brickYPos,
              bricks.current.width,
              bricks.current.height
            );
            ctx.current.fillStyle = canvas.current.color;
            ctx.current.fill();
            ctx.current.closePath();
          }
        }
      }
    };

    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
    movePaddle();
    drawBall();
    drawPaddle();
    drawBricks();
    // detectBrickCollision();
    // drawScore();
    // if (instructionsVisible) {
    //   drawIntructions();
    // }
    // if (countdown.isVisible) {
    //   drawCountdown();
    // }
    // if (gameEnded) {
    //   drawGameOver();
    // }
  }, [ctx, paddle, ball, directionPressed, canvas]);

  useEffect(() => {
    // dpr.current = window.devicePixelRatio || 1;
  }, []);

  useEffect(() => {
    setCanvasPixelWidth(canvas.current.width * dpr.current);
    setCanvasPixelHeight(canvas.current.height * dpr.current);
  }, [dpr, canvas]);

  useEffect(() => {
    initGameProperties();
    draw();

    animationInterval.current = window.setInterval(draw, 1000);
  }, []);

  return (
    <canvas
      ref={canvasElement}
      className={styles.canvas}
      width={canvasPixelWidth}
      height={canvasPixelHeight}
    />
  );
}

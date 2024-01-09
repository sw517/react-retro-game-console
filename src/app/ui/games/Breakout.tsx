'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Direction } from '@/types/direction';
import styles from './styles.module.scss';
import { type Paddle, Ball, Bricks, Canvas } from '@/types/breakout';
import CanvasComponent from './Canvas';

const initialCanvas: Canvas = {
  width: 167,
  height: 121,
  color: '#ccc',
  background: '#333333',
};
const initialBall: Ball = { xPos: 0, yPos: 0, dy: 0, dx: 0, diameter: 3 };
const initialPaddle: Paddle = { xPos: 0, width: 50, height: 5 };
const initialBricks: Bricks = {
  columns: 5,
  rows: 3,
  width: 20,
  height: 5,
  padding: 8,
  xOffset: 12,
  yOffset: 20,
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
  const score = useRef(0);
  const gameActive = useRef(false);
  const gamePaused = useRef(false);
  const gameOver = useRef(false);
  const gameWon = useRef(false);
  const instructionsVisible = useRef(true);
  const countdownVisible = useRef(false);
  const countdown = useRef(3);
  const soundtrackAudio = useRef<HTMLAudioElement>(
    new Audio('/audio/breakout.mp3')
  );
  const collisionAudio = useRef<HTMLAudioElement>(
    new Audio('/audio/click.mp3')
  );

  const initGameProperties = useCallback(() => {
    ctx.current = canvasElement.current?.getContext('2d');

    if (!ctx.current) return;

    canvas.current.width = ctx.current.canvas.clientWidth;
    canvas.current.height = ctx.current.canvas.clientHeight;

    ctx.current.setTransform(1, 0, 0, 1, 0, 0); // Prevent context.scale doubling when reset
    ctx.current.scale(dpr.current, dpr.current); // Scale the drawings to match the dimensions of the canvas

    // Init ball
    ball.current.xPos = canvas.current.width / 2;
    ball.current.yPos =
      canvas.current.height - paddle.current.height - ball.current.diameter - 2;

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

  const changeBallSpeed = (speed: number) => {
    ball.current.dx = ball.current.dx < 0 ? -speed : speed;
    ball.current.dy = ball.current.dy < 0 ? -speed : speed;
  };

  const draw = useCallback(() => {
    if (!ctx.current) return;

    ctx.current.setTransform(1, 0, 0, 1, 0, 0); // Prevent context.scale doubling when reset
    ctx.current.scale(dpr.current, dpr.current); // Scale the drawings to match the dimensions of the canvas

    const movePaddle = () => {
      if (!gameActive.current || gamePaused.current) return;

      if (directionPressed === Direction.RIGHT) {
        if (paddle.current.xPos + paddle.current.width < canvas.current.width) {
          paddle.current.xPos += 3;
        }
      } else if (directionPressed === Direction.LEFT) {
        if (paddle.current.xPos >= 0) {
          paddle.current.xPos -= 3;
        }
      }
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
        setGameOver();
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
      ctx.current.fillStyle = canvas.current.color;
      ctx.current.fill();
      ctx.current.closePath();
      const newXPos = gamePaused.current
        ? ball.current.xPos
        : ball.current.xPos + ball.current.dx;
      const newYPos = gamePaused.current
        ? ball.current.yPos
        : ball.current.yPos + ball.current.dy;
      ball.current.xPos = newXPos;
      ball.current.yPos = newYPos;
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
      ctx.current.fillStyle = canvas.current.color;
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

    const setGameOver = (won = false) => {
      gameActive.current = false;
      gameOver.current = true;
      if (won) {
        gameWon.current = true;
      }

      changeBallSpeed(0);
      soundtrackAudio.current.pause();
      soundtrackAudio.current.currentTime = 0;
    };

    const checkEndGame = () => {
      if (
        score.current ===
        bricks.current.columns * bricks.current.rows * bricks.current.points
      ) {
        setGameOver(true);
      }
    };

    const detectBrickCollision = () => {
      for (let c = 0; c < bricks.current.columns; c += 1) {
        for (let r = 0; r < bricks.current.rows; r += 1) {
          const brick = bricks.current.instances[c][r];
          if (brick.status === 1) {
            if (
              ball.current.xPos > brick.x - ball.current.diameter &&
              ball.current.xPos <
                brick.x + bricks.current.width + ball.current.diameter &&
              ball.current.yPos > brick.y - ball.current.diameter &&
              ball.current.yPos <
                brick.y + bricks.current.height + ball.current.diameter
            ) {
              // const direction = getBrickCollisionDirection(brick);
              ball.current.dy = -ball.current.dy;
              brick.status = 0;
              score.current = score.current + bricks.current.points;

              collisionAudio.current.play();
              checkEndGame();
            }
          }
        }
      }
    };

    const drawScore = () => {
      if (!ctx.current) return;

      ctx.current.translate(0.5, 0.5);

      ctx.current.font = '10px Courier';
      ctx.current.fillStyle = canvas.current.color;
      ctx.current.fillText(`Score: ${score.current}`, 5, 12);

      ctx.current.translate(-0.5, -0.5);
    };

    const drawIntructions = () => {
      if (!ctx.current) return;

      ctx.current.translate(0.5, 0.5);
      ctx.current.beginPath();
      ctx.current.rect(0, 0, canvas.current.width, 56);
      ctx.current.fillStyle = canvas.current.color;
      ctx.current.fill();
      ctx.current.lineWidth = 3;
      ctx.current.strokeStyle = canvas.current.background;
      ctx.current.stroke();
      ctx.current.closePath();
      ctx.current.font = '10px Courier';
      ctx.current.fillStyle = canvas.current.background;
      ctx.current.fillText('Press Start to begin', 8, 20);
      ctx.current.fillText('Left/Right arrows to move', 8, 40);
      ctx.current.translate(-0.5, -0.5);
    };

    const drawCountdown = () => {
      if (!ctx.current) return;

      ctx.current.font = '18px Courier';
      ctx.current.fillStyle = canvas.current.color;
      ctx.current.fillText(
        String(countdown.current),
        canvas.current.width / 2 - 5,
        canvas.current.height / 2 + 30
      );
    };

    const drawGameOver = () => {
      if (!ctx.current) return;

      const gameText = gameWon.current ? 'WINNER!' : 'GAME OVER';
      const textOffset = gameWon.current ? 40 : 50;
      ctx.current.font = '18px Courier';
      ctx.current.fillStyle = canvas.current.color;
      ctx.current.fillText(
        gameText,
        canvas.current.width / 2 - textOffset,
        canvas.current.height / 2 + 10
      );

      ctx.current.font = '10px Courier';
      ctx.current.fillStyle = canvas.current.color;
      ctx.current.fillText(
        '(Press Start to restart)',
        canvas.current.width / 2 - 72,
        canvas.current.height / 2 + 30
      );
    };

    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
    movePaddle();
    drawBall();
    drawPaddle();
    drawBricks();
    detectBrickCollision();
    drawScore();
    if (instructionsVisible.current) {
      drawIntructions();
    }
    if (countdownVisible.current) {
      drawCountdown();
    }
    if (gameOver.current) {
      drawGameOver();
    }
  }, [directionPressed]);

  useEffect(() => {
    dpr.current = window.devicePixelRatio || 1;
    canvas.current.width = canvasElement.current?.clientWidth || 0;
    canvas.current.height = canvasElement.current?.clientHeight || 0;
    setCanvasPixelWidth(canvas.current.width * dpr.current);
    setCanvasPixelHeight(canvas.current.height * dpr.current);
  }, []);

  useEffect(() => {
    if (startPressed && !gameOver.current) {
      if (soundtrackAudio.current.paused) {
        soundtrackAudio.current.play();
      } else {
        soundtrackAudio.current.pause();
      }
    }
  }, [startPressed]);

  useEffect(() => {
    initGameProperties();
  }, [initGameProperties]);

  useEffect(() => {
    if (startPressed) {
      if (gameActive.current) {
        gamePaused.current = !gamePaused.current;
      }

      if (instructionsVisible.current) {
        instructionsVisible.current = false;

        countdownVisible.current = true;
        const countdownInterval = window.setInterval(() => {
          countdown.current = countdown.current - 1;

          if (countdown.current <= 0) {
            window.clearInterval(countdownInterval);
            countdownVisible.current = false;

            gameActive.current = true;
            changeBallSpeed(1);
          }
        }, 1000);
      } else if (gameOver.current) {
        changeBallSpeed(0);
        countdown.current = 3;
        instructionsVisible.current = true;
        countdownVisible.current = false;
        gameActive.current = false;
        gameOver.current = false;
        gameWon.current = false;
        score.current = 0;
        ball.current = initialBall;
        paddle.current = initialPaddle;
        bricks.current = initialBricks;
        initGameProperties();
      }
    }
  }, [initGameProperties, startPressed]);

  return (
    <CanvasComponent
      ref={canvasElement}
      className={styles.canvas}
      width={canvasPixelWidth}
      height={canvasPixelHeight}
      draw={draw}
    />
  );
}

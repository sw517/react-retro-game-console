'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Direction } from '@/types/input';
import { InputValue } from '@/types/input';
import {
  getItemFromLocalStorage,
  setItemInLocalStorage,
} from '@/app/helpers/local-storage';
import styles from './styles.module.scss';
import {
  type Paddle,
  Ball,
  BrickInstances,
  Canvas,
  BrickConfig,
  BrickColumn,
  Brick,
  ColorConfig,
} from '@/types/breakout';
import { getBallConfig, getBrickConfig, getColorConfig } from './config';

type GameState = 'ready' | 'countdown' | 'active' | 'ended';
type CollisionAxis = 'vertical' | 'horizontal';
type CollisionDirection = 'left' | 'right' | 'top' | 'bottom';
type CollisionDirectionObject = {
  dir: CollisionDirection;
  val: number;
};

const initialCanvas: Canvas = {
  width: 167,
  height: 121,
};
const initialPaddle: Paddle = { xPos: 0, yPos: 5, width: 50, height: 5 };

export default function Breakout({ soundEnabled }: { soundEnabled: boolean }) {
  const input = useRef<InputValue | null>(null);
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
  const score = useRef(0);
  const highestScore = useRef(0);
  const level = useRef(0);
  const highestLevel = useRef(0);
  const colorConfig = useRef<ColorConfig>(getColorConfig(level.current));
  const ball = useRef<Ball>(getBallConfig(level.current));
  const paddle = useRef<Paddle>(initialPaddle);
  const brickConfig = useRef<BrickConfig>(getBrickConfig(level.current));
  const brickInstances = useRef<BrickInstances>([]);
  const gameState = useRef<GameState>('ready');
  const gamePaused = useRef(false);
  const gameWon = useRef(false);
  const countdown = useRef(3);
  const soundtrackAudio = useRef<HTMLAudioElement>(
    new Audio('/audio/breakout.mp3')
  );
  const collisionAudio = useRef<HTMLAudioElement>(new Audio('/audio/beep.mp3'));
  const gameWonAudio = useRef<HTMLAudioElement>(
    new Audio('/audio/victory.mp3')
  );
  const gameLostAudio = useRef<HTMLAudioElement>(
    new Audio('/audio/game-over.mp3')
  );
  const countdownAudio = useRef<HTMLAudioElement>(
    new Audio('/audio/countdown.mp3')
  );
  const drawInterval = useRef<number | null>(null);
  const countdownInterval = useRef<number | null>(null);

  const initGameProperties = useCallback(() => {
    ctx.current = canvasElement.current?.getContext('2d');

    if (!ctx.current) return;

    canvas.current.width = ctx.current.canvas.clientWidth;
    canvas.current.height = ctx.current.canvas.clientHeight;

    // Init ball
    ball.current.dx = 0;
    ball.current.dy = 0;
    ball.current.xPos = canvas.current.width / 2;
    ball.current.yPos =
      canvas.current.height -
      paddle.current.height -
      paddle.current.yPos -
      ball.current.diameter -
      8;

    // Init paddle
    paddle.current.xPos = (canvas.current.width - paddle.current.width) / 2;

    // Init bricks
    for (let c = 0; c < brickConfig.current.columns; c += 1) {
      brickInstances.current[c] = [];
      for (let r = 0; r < brickConfig.current.rows; r += 1) {
        brickInstances.current[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }, []);

  const changeBallSpeed = (speed: number) => {
    ball.current.dx = ball.current.dx < 0 ? -speed : speed;
    ball.current.dy = ball.current.dy < 0 ? -speed : speed;
  };

  const getBrickWidth = () => {
    return (
      (canvas.current.width -
        brickConfig.current.xOffset * 2 -
        brickConfig.current.padding * (brickConfig.current.columns - 1)) /
      brickConfig.current.columns
    );
  };

  const draw = useCallback(() => {
    if (!ctx.current) return;

    ctx.current.setTransform(1, 0, 0, 1, 0, 0); // Prevent context.scale doubling when reset
    ctx.current.scale(dpr.current, dpr.current); // Scale the drawings to match the dimensions of the canvas

    const drawBackground = () => {
      if (!ctx.current) return;

      ctx.current.beginPath();
      ctx.current.rect(0, 0, canvas.current.width, canvas.current.height);
      ctx.current.fillStyle = colorConfig.current.background;
      ctx.current.fill();
      ctx.current.closePath();
    };

    const movePaddle = () => {
      if (gameState.current !== 'active' || gamePaused.current) return;

      if (input.current === Direction.RIGHT) {
        if (paddle.current.xPos + paddle.current.width < canvas.current.width) {
          paddle.current.xPos += 3;
        }
      } else if (input.current === Direction.LEFT) {
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
            paddle.current.height -
            paddle.current.yPos &&
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
      ctx.current.fillStyle = colorConfig.current.ball;
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
        canvas.current.height - paddle.current.height - paddle.current.yPos,
        paddle.current.width,
        paddle.current.height
      );
      ctx.current.fillStyle = colorConfig.current.paddle;
      ctx.current.fill();
      ctx.current.closePath();
    };

    const drawBricks = () => {
      if (!ctx.current) return;

      for (let c = 0; c < brickConfig.current.columns; c += 1) {
        for (let r = 0; r < brickConfig.current.rows; r += 1) {
          if (brickInstances.current[c][r].status === 1) {
            const brickXPos =
              c * (getBrickWidth() + brickConfig.current.padding) +
              brickConfig.current.xOffset;
            const brickYPos =
              r * (brickConfig.current.height + brickConfig.current.padding) +
              brickConfig.current.yOffset;
            brickInstances.current[c][r].x = brickXPos;
            brickInstances.current[c][r].y = brickYPos;
            ctx.current.beginPath();
            ctx.current.rect(
              brickXPos,
              brickYPos,
              getBrickWidth(),
              brickConfig.current.height
            );
            ctx.current.fillStyle = colorConfig.current.brick;
            ctx.current.fill();
            ctx.current.closePath();
          }
        }
      }
    };

    const setGameOver = (won = false) => {
      changeBallSpeed(0);
      soundtrackAudio.current.pause();
      soundtrackAudio.current.currentTime = 0;

      if (gameState.current !== 'ended') {
        if (won) {
          gameWon.current = true;
          if (soundEnabled) {
            gameWonAudio.current.play();
          }
        } else if (soundEnabled) {
          gameLostAudio.current.play();
        }
      }
      gameState.current = 'ended';
      if (highestScore.current < score.current) {
        highestScore.current = score.current;

        if (gameWon.current) {
          highestLevel.current = level.current = level.current + 1;
        } else {
          highestLevel.current = level.current;
        }
        setItemInLocalStorage('breakout-record', {
          highestLevel: highestLevel.current,
          highestScore: highestScore.current,
        });
      }
    };

    const checkEndGame = () => {
      if (
        !brickInstances.current.some((column: BrickColumn) => {
          return column.some((brick: Brick) => {
            return brick.status === 1;
          });
        })
      ) {
        setGameOver(true);
      }
    };

    const getBrickCollisionAxis = (brick: Brick): CollisionAxis => {
      const ballRadius = ball.current.diameter / 2;
      const left: CollisionDirectionObject = {
        dir: 'left',
        val: Math.abs(brick.x - ball.current.xPos - ballRadius),
      };
      const right: CollisionDirectionObject = {
        dir: 'right',
        val: Math.abs(
          brick.x + getBrickWidth() - ball.current.xPos + ballRadius
        ),
      };
      const top: CollisionDirectionObject = {
        dir: 'top',
        val: Math.abs(brick.y - ball.current.yPos - ballRadius),
      };
      const bottom: CollisionDirectionObject = {
        dir: 'bottom',
        val: Math.abs(
          brick.y + brickConfig.current.height - ball.current.yPos + ballRadius
        ),
      };
      const directions: CollisionDirectionObject[] = [left, right, top, bottom];
      const closestDirection = directions.reduce(
        (
          closest: CollisionDirectionObject,
          current: CollisionDirectionObject
        ) => (closest.val < current.val ? closest : current),
        directions[0]
      );
      return ['top', 'bottom'].includes(closestDirection.dir)
        ? 'horizontal'
        : 'vertical';
    };

    const detectBrickCollision = () => {
      for (let c = 0; c < brickConfig.current.columns; c += 1) {
        for (let r = 0; r < brickConfig.current.rows; r += 1) {
          const brick = brickInstances.current[c][r];
          if (brick.status === 1) {
            if (
              ball.current.xPos > brick.x - ball.current.diameter &&
              ball.current.xPos <
                brick.x + getBrickWidth() + ball.current.diameter &&
              ball.current.yPos > brick.y - ball.current.diameter &&
              ball.current.yPos <
                brick.y + brickConfig.current.height + ball.current.diameter
            ) {
              const axis = getBrickCollisionAxis(brick);
              if (axis === 'horizontal') {
                ball.current.dy = -ball.current.dy;
              } else {
                ball.current.dx = -ball.current.dx;
              }
              brick.status = 0;
              score.current = score.current + brickConfig.current.points;

              if (soundEnabled) {
                collisionAudio.current.play();
              }
              checkEndGame();
            }
          }
        }
      }
    };

    const drawScore = () => {
      if (!ctx.current) return;

      ctx.current.translate(0.5, 0.5);

      const width = canvas.current.width;
      const fontSize = width < 200 ? 6 : width < 250 ? 7 : 8;
      ctx.current.font = `${fontSize}px Courier`;
      ctx.current.textAlign = 'left';
      ctx.current.fillStyle = colorConfig.current.text;
      ctx.current.fillText(
        `SCORE: ${score.current}  LVL: ${level.current + 1}  HI-SCORE: ${
          highestScore.current
        } (LVL ${highestLevel.current + 1})`,
        5,
        12
      );

      ctx.current.translate(-0.5, -0.5);
    };

    const drawInstructions = () => {
      if (!ctx.current) return;

      ctx.current.font = '18px Courier';
      ctx.current.fillStyle = colorConfig.current.text;
      ctx.current.textAlign = 'center';
      ctx.current.fillText(
        'PRESS START',
        canvas.current.width / 2,
        canvas.current.height / 2 + 30
      );
    };

    const drawCountdown = () => {
      if (!ctx.current) return;

      ctx.current.font = '18px Courier';
      ctx.current.fillStyle = colorConfig.current.text;
      ctx.current.textAlign = 'center';
      ctx.current.fillText(
        String(countdown.current),
        canvas.current.width / 2,
        canvas.current.height / 2 + 30
      );
    };

    const drawGameOver = () => {
      if (!ctx.current) return;

      ctx.current.textAlign = 'center';
      ctx.current.font = '16px Courier';
      ctx.current.fillStyle = colorConfig.current.text;
      ctx.current.fillText(
        gameWon.current ? `LEVEL ${level.current + 1} COMPLETE` : 'GAME OVER',
        canvas.current.width / 2,
        canvas.current.height / 2 + 20
      );

      ctx.current.font = '10px Courier';
      ctx.current.fillText(
        `(PRESS START TO ${gameWon.current ? 'CONTINUE' : 'RESET'})`,
        canvas.current.width / 2,
        canvas.current.height / 2 + 35
      );
    };

    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
    drawBackground();
    movePaddle();
    drawBall();
    drawPaddle();
    drawBricks();
    detectBrickCollision();
    drawScore();
    if (gameState.current === 'ready') {
      drawInstructions();
    }
    if (gameState.current === 'countdown') {
      drawCountdown();
    }
    if (gameState.current === 'ended') {
      drawGameOver();
    }
  }, [soundEnabled]);

  useEffect(() => {
    dpr.current = window.devicePixelRatio || 1;
    canvas.current.width = canvasElement.current?.clientWidth || 0;
    canvas.current.height = canvasElement.current?.clientHeight || 0;
    setCanvasPixelWidth(canvas.current.width * dpr.current);
    setCanvasPixelHeight(canvas.current.height * dpr.current);

    const storedUserRecord = getItemFromLocalStorage('breakout-record') || {
      highestLevel: 1,
      highestScore: 0,
    };
    highestLevel.current = storedUserRecord.highestLevel;
    highestScore.current = storedUserRecord.highestScore;

    const soundtrackAudioNode = soundtrackAudio.current;
    const countdownAudioNode = countdownAudio.current;

    return () => {
      countdownInterval.current &&
        window.clearInterval(countdownInterval.current);
      if (soundtrackAudioNode) {
        soundtrackAudioNode.pause();
        soundtrackAudioNode.currentTime = 0;
      }
      if (countdownAudioNode) {
        countdownAudioNode.pause();
        countdownAudioNode.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    drawInterval.current = window.setInterval(draw, 10);
    const intervalId = drawInterval.current;

    return () => {
      window.clearInterval(intervalId);
    };
  }, [draw]);

  useEffect(() => {
    initGameProperties();
  }, [initGameProperties]);

  useEffect(() => {
    const callback = (inputValue: InputValue) => {
      input.current = inputValue;

      if (input.current === Button.START) {
        switch (gameState.current) {
          case 'ready':
            if (soundEnabled) soundtrackAudio.current.play();
            gameState.current = 'countdown';

            if (soundEnabled) countdownAudio.current.play();
            countdownInterval.current &&
              window.clearInterval(countdownInterval.current);
            countdownInterval.current = window.setInterval(() => {
              countdown.current = countdown.current - 1;

              if (countdown.current <= 0) {
                countdownInterval.current &&
                  window.clearInterval(countdownInterval.current);

                gameState.current = 'active';
                changeBallSpeed(getBallConfig(level.current).speed);
              }
            }, 1000);
            break;

          case 'countdown':
            break;

          case 'active':
            gamePaused.current = !gamePaused.current;
            if (soundEnabled) {
              if (gamePaused.current) {
                soundtrackAudio.current.pause();
              } else {
                soundtrackAudio.current.play();
              }
            }
            break;

          case 'ended':
            if (gameWon.current) {
              level.current = level.current + 1;
            } else {
              score.current = 0;
              level.current = 0;
            }
            changeBallSpeed(0);
            countdown.current = 3;
            gameState.current = 'ready';
            gameWon.current = false;
            ball.current = getBallConfig(level.current);
            paddle.current = initialPaddle;
            brickInstances.current = [];
            brickConfig.current = getBrickConfig(level.current);
            colorConfig.current = getColorConfig(level.current);
            initGameProperties();
            break;
        }
      }
    };
    window.emitter.on('input', callback);
    return () => {
      window.emitter.off('input', callback);
    };
  }, [initGameProperties, soundEnabled]);

  return (
    <canvas
      ref={canvasElement}
      className={styles.canvas}
      width={canvasPixelWidth}
      height={canvasPixelHeight}
    />
  );
}

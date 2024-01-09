'use client';

import styles from '@/app/ui/GameConsole/styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import useResponsive from '@/app/hooks/useResponsive';

const punchHoleRowCount = 8;
const punchHoleDiameter = 1.5;
const punchHoleFill = '#000';
const indentFill = 'rgba(0, 0, 0, 0.1)';

export default function Speaker() {
  const [speakerWidth, setSpeakerWidth] = useState(56);
  const [speakerHeight, setSpeakerHeight] = useState(56);

  const { width: windowWidth } = useResponsive();
  const [isMounted, setIsMounted] = useState(false);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null | undefined>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (windowWidth >= 400) {
      setSpeakerWidth(80);
      setSpeakerHeight(80);
    } else {
      setSpeakerWidth(56);
      setSpeakerHeight(56);
    }
  }, [windowWidth]);

  useEffect(() => {
    if (!isMounted) return;
    if (!canvas.current) return;
    context.current = canvas.current.getContext('2d');

    if (!context.current) return;

    const ctx = context.current;
    ctx.clearRect(0, 0, 200, 200);

    ctx.translate(
      -(speakerWidth / punchHoleRowCount) / 2,
      -(speakerHeight / punchHoleRowCount) / 2
    );

    const getFillStyle = (i: number, j: number): string => {
      if (i % 2) {
        return j % 2 ? indentFill : punchHoleFill;
      }
      return j % 2 ? punchHoleFill : indentFill;
    };

    const shouldSkipPunchHole = (i: number, j: number): boolean => {
      if (i === 1 && j === 1) return true;
      if (i === 1 && j === punchHoleRowCount) return true;
      if (i === punchHoleRowCount && j === 1) return true;
      if (i === punchHoleRowCount && j === punchHoleRowCount) return true;
      return false;
    };

    loopI: for (let i = 1; i <= punchHoleRowCount; i += 1) {
      loopJ: for (let j = 1; j <= punchHoleRowCount; j += 1) {
        if (shouldSkipPunchHole(i, j)) continue loopJ;

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.translate(
          -(speakerWidth / punchHoleRowCount) / 2,
          -(speakerHeight / punchHoleRowCount) / 2
        );

        ctx.beginPath();
        ctx.fillStyle = getFillStyle(i, j);
        ctx.arc(
          (speakerWidth / punchHoleRowCount) * j,
          (speakerHeight / punchHoleRowCount) * i,
          punchHoleDiameter,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();
      }
    }
  }, [isMounted, speakerWidth, speakerHeight]);

  return (
    <canvas
      ref={canvas}
      className={styles.speaker}
      width={speakerWidth}
      height={speakerHeight}
    />
  );
}

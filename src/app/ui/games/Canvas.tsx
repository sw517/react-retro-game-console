'use client';

import { ForwardedRef, forwardRef, useEffect, useRef } from 'react';

const Canvas = forwardRef(function Canvas(
  {
    width,
    height,
    className,
    draw,
  }: {
    draw: () => void;
    className: string;
    width: number;
    height: number;
  },
  ref: ForwardedRef<HTMLCanvasElement>
) {
  const interval = useRef<number | null>();
  useEffect(() => {
    if (interval.current) {
      window.clearInterval(interval.current);
    }
    interval.current = window.setInterval(draw, 10);
  }, [draw]);

  return (
    <canvas className={className} ref={ref} width={width} height={height} />
  );
});

export default Canvas;

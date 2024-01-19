'use client';

import dynamic from 'next/dynamic';
import mitt from 'mitt';
import { useEffect } from 'react';

const GameConsole = dynamic(() => import('@/app/ui/GameConsole/Console'), {
  ssr: false,
});

const emitter = mitt();

export default function Page() {
  useEffect(() => {
    window.emitter = emitter;
  }, []);
  return (
    <div className="flex p-4 items-center justify-center h-full w-full">
      <GameConsole />
    </div>
  );
}

import dynamic from 'next/dynamic';
const GameConsole = dynamic(() => import('@/app/ui/GameConsole/Console'), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex p-4 items-center justify-center h-full w-full">
      <GameConsole />
    </div>
  );
}

import clsx from 'clsx';
import styles from '@/app/ui/GameConsole/styles.module.scss';
import { Grandstander } from 'next/font/google';

const grandstander = Grandstander({ subsets: ['latin'], weight: '800' });

export default function ConsoleLabel() {
  return (
    <div className={clsx(styles['console-label'], grandstander.className)}>
      sw<span className="text-red-600">5</span>
      <span className="text-purple-500">1</span>
      <span className="text-green-300">7</span>
    </div>
  );
}

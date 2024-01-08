import styles from '@/app/ui/GameConsole/styles.module.scss';
import { ReactNode } from 'react';
import PowerLed from './PowerLed';
import ConsoleLabel from './ConsoleLabel';

export default function Screen({
  children,
  power,
}: {
  children: ReactNode;
  power: 0 | 1;
}) {
  return (
    <div className={styles.screen}>
      <PowerLed power={power} />
      <div className={styles['screen-inner']}>{children}</div>
      <ConsoleLabel />
    </div>
  );
}

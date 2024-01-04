import styles from '@/app/ui/GameConsole/styles.module.scss';
import { ReactNode } from 'react';

export default function Screen({ children }: { children: ReactNode }) {
  return <div className={styles.screen}>{children}</div>;
}

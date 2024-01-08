import clsx from 'clsx';
import styles from '@/app/ui/GameConsole/styles.module.scss';
import { Fragment } from 'react';

export default function PowerLED({
  power,
}: {
  power: 0 | 1;
  className?: string;
}) {
  let eclipses = [];
  for (let i: number = 0; i <= 2; i++) {
    eclipses.push(
      <Fragment key={i}>
        <span className={styles['led-eclipse-end']} />
        <span className={styles['led-eclipse-start']} />
      </Fragment>
    );
  }

  return (
    <div
      className={styles.power}
      data-testid="power-led"
      data-status={power ? 'on' : 'off'}
    >
      <span
        className={clsx([styles.led, power ? styles['led--active'] : null])}
      />
      {/* <span className={styles['led-eclipse-wrapper']}>{eclipses}</span> */}
      <span className={styles['power-label']}>POWER</span>
    </div>
  );
}

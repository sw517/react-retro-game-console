import styles from '@/app/ui/GameConsole/styles.module.scss';
import clsx from 'clsx';

export default function Button({
  letter,
  className,
}: {
  letter: string;
  className?: string;
}) {
  return (
    <button className={clsx([className, styles['round-button']])}>
      {letter}
    </button>
  );
}

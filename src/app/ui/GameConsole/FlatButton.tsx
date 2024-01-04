import styles from '@/app/ui/GameConsole/styles.module.scss';
import clsx from 'clsx';

export default function FlatButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={clsx([className, 'inline-block text-center'])}>
      <button className={styles['flat-button']} aria-label={label} />
      <span className={styles['flat-button-label']} aria-hidden>
        {label}
      </span>
    </div>
  );
}

import styles from '@/app/ui/GameConsole/styles.module.scss';
import DirectionalPadImage from './DirectionalPadImage';

export default function DirectionalPad() {
  return (
    <button className={styles['d-pad']}>
      <DirectionalPadImage />
    </button>
  );
}

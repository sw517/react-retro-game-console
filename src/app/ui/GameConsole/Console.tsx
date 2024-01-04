import styles from '@/app/ui/GameConsole/styles.module.scss';
import RoundButton from './RoundButton';
import FlatButton from './FlatButton';
import DirectionalPad from './DirectionalPad';
import Screen from './Screen';

export default function Console() {
  return (
    <div className={styles.console}>
      <Screen>
        <canvas />
      </Screen>
      <div className="flex items-center justify-between mt-5">
        <DirectionalPad />
        <div className="flex">
          <RoundButton letter="B" className="mt-6 mr-6" />
          <RoundButton letter="A" />
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <FlatButton label="SELECT" />
        <FlatButton label="START" className="ml-6" />
      </div>
    </div>
  );
}

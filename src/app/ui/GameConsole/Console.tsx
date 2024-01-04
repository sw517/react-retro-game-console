'use client';

import styles from '@/app/ui/GameConsole/styles.module.scss';
import RoundButton from './RoundButton';
import FlatButton from './FlatButton';
import DirectionalPad from './DirectionalPad';
import Screen from './Screen';
import { useState } from 'react';
import { Direction } from '@/types/direction';

export default function Console() {
  const [directionPressed, setDirectionPressed] = useState<Direction | null>(
    null
  );
  const [aButtonPressed, setAButtonPressed] = useState<boolean>(false);
  const [bButtonPressed, setBButtonPressed] = useState<boolean>(false);
  const [selectButtonPressed, setSelectButtonPressed] =
    useState<boolean>(false);
  const [startButtonPressed, setStartButtonPressed] = useState<boolean>(false);

  return (
    <div className={styles.console}>
      <Screen>
        <canvas />
      </Screen>
      <div className="flex items-center justify-between mt-5">
        <DirectionalPad
          directionPressed={directionPressed}
          onPress={setDirectionPressed}
        />
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

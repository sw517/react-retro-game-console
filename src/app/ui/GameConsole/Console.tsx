'use client';

import styles from '@/app/ui/GameConsole/styles.module.scss';
import RoundButton from './RoundButton';
import FlatButton from './FlatButton';
import DirectionalPad from './DirectionalPad';
import Screen from './Screen';
import Trademark from './Trademark';
import Breakout from '@/app/ui/games/Breakout';
import { useRef, useState } from 'react';
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

  const handleDirectionPresesed = (direction: Direction | null) => {
    if (direction) {
      try {
        window.navigator.vibrate(50);
      } catch (error) {}
    }
    setDirectionPressed(direction);
  };

  const handleAButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        window.navigator.vibrate(100);
      } catch (error) {}
    }
    setAButtonPressed(pressed);
  };

  const handleBButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        window.navigator.vibrate(100);
      } catch (error) {}
    }
    setBButtonPressed(pressed);
  };

  const handleSelectButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        window.navigator.vibrate(100);
      } catch (error) {}
    }
    setSelectButtonPressed(pressed);
  };

  const handleStartButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        window.navigator.vibrate(100);
      } catch (error) {}
    }
    setStartButtonPressed(pressed);
  };

  return (
    <div className={styles.console}>
      <Screen>
        <Breakout
          directionPressed={directionPressed}
          startPressed={startButtonPressed}
        />
      </Screen>
      <div className="mt-4 min-[400px]:mt-6 text-center">
        <Trademark />
      </div>
      <div className="flex items-center justify-between mt-5">
        <DirectionalPad
          directionPressed={directionPressed}
          onPress={handleDirectionPresesed}
        />
        <div className="flex">
          <RoundButton
            pressed={bButtonPressed}
            onPress={handleBButtonPressed}
            letter="B"
            className="mt-6 mr-6"
          />
          <RoundButton
            pressed={aButtonPressed}
            onPress={handleAButtonPressed}
            letter="A"
          />
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <FlatButton
          pressed={selectButtonPressed}
          onPress={handleSelectButtonPressed}
          label="SELECT"
        />
        <FlatButton
          pressed={startButtonPressed}
          onPress={handleStartButtonPressed}
          label="START"
          className="ml-6"
        />
      </div>
    </div>
  );
}

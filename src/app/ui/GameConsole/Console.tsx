'use client';

import styles from '@/app/ui/GameConsole/styles.module.scss';
import RoundButton from './RoundButton';
import FlatButton from './FlatButton';
import DirectionalPad from './DirectionalPad';
import Screen from './Screen';
import Trademark from './Trademark';
import Breakout from '@/app/ui/games/Breakout';
import Speaker from './Speaker';
import { useState } from 'react';
import { Direction } from '@/types/direction';

const buttonVibrateLength = 10;

export default function Console() {
  const [power, setPower] = useState<0 | 1>(0);
  const [directionPressed, setDirectionPressed] = useState<Direction | null>(
    null
  );
  const [aButtonPressed, setAButtonPressed] = useState<boolean>(false);
  const [bButtonPressed, setBButtonPressed] = useState<boolean>(false);
  const [selectButtonPressed, setSelectButtonPressed] =
    useState<boolean>(false);
  const [startButtonPressed, setStartButtonPressed] = useState<boolean>(false);

  const handleDirectionPresesed = (direction: Direction | null) => {
    if (direction && directionPressed !== direction) {
      try {
        window.navigator.vibrate(buttonVibrateLength);
      } catch (error) {}
    }
    setDirectionPressed(direction);
  };

  const handleAButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        window.navigator.vibrate(buttonVibrateLength);
      } catch (error) {}
    }
    setAButtonPressed(pressed);
  };

  const handleBButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        window.navigator.vibrate(buttonVibrateLength);
      } catch (error) {}
    }
    setBButtonPressed(pressed);
  };

  const handleSelectButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        window.navigator.vibrate(buttonVibrateLength);
      } catch (error) {}
    }
    setSelectButtonPressed(pressed);
  };

  const handleStartButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        window.navigator.vibrate(buttonVibrateLength);
      } catch (error) {}

      if (!power) {
        setPower(1);
        return;
      }
    }
    setStartButtonPressed(pressed);
  };

  return (
    <div className={styles.console}>
      <Screen power={power}>
        {!!power && (
          <Breakout
            directionPressed={directionPressed}
            startPressed={startButtonPressed}
          />
        )}
      </Screen>
      <div className="mt-4 min-[400px]:mt-6 text-center">
        <Trademark />
      </div>
      <div className="flex items-center justify-between mt-5">
        <DirectionalPad
          directionPressed={directionPressed}
          onPress={handleDirectionPresesed}
          dataTestId="directional-pad-button"
        />
        <div className="flex">
          <RoundButton
            pressed={bButtonPressed}
            onPress={handleBButtonPressed}
            letter="B"
            className="mt-6 mr-6"
            dataTestId="b-button"
          />
          <RoundButton
            pressed={aButtonPressed}
            onPress={handleAButtonPressed}
            letter="A"
            dataTestId="a-button"
          />
        </div>
      </div>
      <div className="flex justify-center mt-6 min-[400px]:mt-10">
        <FlatButton
          pressed={selectButtonPressed}
          onPress={handleSelectButtonPressed}
          label="SELECT"
          dataTestId="select-button"
        />
        <FlatButton
          pressed={startButtonPressed}
          onPress={handleStartButtonPressed}
          label="START"
          className="ml-6"
          dataTestId="start-button"
        />
      </div>
      <Speaker />
    </div>
  );
}

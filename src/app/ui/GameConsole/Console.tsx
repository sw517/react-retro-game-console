'use client';

import styles from '@/app/ui/GameConsole/styles.module.scss';
import RoundButton from './RoundButton';
import FlatButton from './FlatButton';
import DirectionalPad from './DirectionalPad';
import Screen from './Screen';
import Trademark from './Trademark';
import Breakout from '@/app/ui/Breakout/Breakout';
import Settings from '../Settings';
import Speaker from './Speaker';
import { useState } from 'react';
import { Direction } from '@/types/direction';
import { ConsoleAppearanceKeys, SettingsKeys } from '@/types/settings';

enum InputType {
  DIRECTION = 'direction',
  BUTTON = 'button',
}

type InputTypeValue = 'A' | 'B' | Direction;

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedSettingsIndex, setSelectedSettingsIndex] = useState(0);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const settingsItems = [
    {
      text: 'Vibration',
      key: SettingsKeys.VIBRATION,
      active: vibrationEnabled,
    },
    { text: 'Sound', key: SettingsKeys.SOUND, active: soundEnabled },
    {
      text: 'Console appearance',
      key: SettingsKeys.APPEARANCE,
      childItems: [
        { text: 'red', key: ConsoleAppearanceKeys.RED },
        { text: 'purple', key: ConsoleAppearanceKeys.PURPLE },
        { text: 'yellow', key: ConsoleAppearanceKeys.YELLOW },
      ],
    },
  ];

  const handleSettingsInput = (inputType: InputType, value: InputTypeValue) => {
    if (inputType === InputType.DIRECTION) {
      if (
        value === Direction.DOWN &&
        selectedSettingsIndex < settingsItems.length - 1
      ) {
        setSelectedSettingsIndex((i) => i + 1);
      } else if (value === Direction.UP && selectedSettingsIndex > 0) {
        setSelectedSettingsIndex((i) => i - 1);
      }
    } else {
      if (value === 'B') {
        setSettingsOpen(false);
      } else if (value === 'A') {
        switch (settingsItems[selectedSettingsIndex].key) {
          case SettingsKeys.SOUND:
            setSoundEnabled(!soundEnabled);
            return;
          case SettingsKeys.VIBRATION:
            setVibrationEnabled(!vibrationEnabled);
            return;
        }
      }
    }
  };

  const handleDirectionPresesed = (direction: Direction | null) => {
    if (direction && directionPressed !== direction) {
      try {
        if (vibrationEnabled) {
          window.navigator.vibrate(buttonVibrateLength);
        }
      } catch (error) {}

      if (settingsOpen) {
        handleSettingsInput(InputType.DIRECTION, direction);
      }
    }
    setDirectionPressed(direction);
  };

  const handleAButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        if (vibrationEnabled) {
          window.navigator.vibrate(buttonVibrateLength);
        }
      } catch (error) {}

      if (settingsOpen) {
        handleSettingsInput(InputType.BUTTON, 'A');
      }
    }
    setAButtonPressed(pressed);
  };

  const handleBButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        if (vibrationEnabled) {
          window.navigator.vibrate(buttonVibrateLength);
        }
      } catch (error) {}

      if (settingsOpen) {
        handleSettingsInput(InputType.BUTTON, 'B');
      }
    }
    setBButtonPressed(pressed);
  };

  const handleSelectButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        if (vibrationEnabled) {
          window.navigator.vibrate(buttonVibrateLength);
        }
      } catch (error) {}
    }

    if (power && pressed) setSettingsOpen(true);
    setSelectButtonPressed(pressed);
  };

  const handleStartButtonPressed = (pressed: boolean) => {
    if (pressed) {
      try {
        if (vibrationEnabled) {
          window.navigator.vibrate(buttonVibrateLength);
        }
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
        {!!power && settingsOpen && (
          <Settings
            selectedIndex={selectedSettingsIndex}
            settingsItems={settingsItems}
          />
        )}
        {!!power && !settingsOpen && (
          <Breakout
            directionPressed={directionPressed}
            startPressed={startButtonPressed}
            soundEnabled={soundEnabled}
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

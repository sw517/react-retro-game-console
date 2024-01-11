'use client';

import styles from '@/app/ui/GameConsole/styles.module.scss';
import Button from './Button';
import DirectionalPad from './DirectionalPad';
import Screen from './Screen';
import Trademark from './Trademark';
import Breakout from '@/app/ui/Breakout/Breakout';
import Settings from '../Settings';
import Speaker from './Speaker';
import { useState } from 'react';
import { Direction, InputValue, Button as ButtonType } from '@/types/input';
import { ConsoleAppearanceKeys, SettingsKeys } from '@/types/settings';

enum InputType {
  DIRECTION = 'direction',
  BUTTON = 'button',
}

type InputTypeValue = 'A' | 'B' | Direction;

const buttonVibrateLength = 10;

export default function Console() {
  const [power, setPower] = useState<0 | 1>(0);
  const [input, setInput] = useState<InputValue | null>(null);
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

  const handleSettingsInput = (inputValue: InputValue) => {
    switch (inputValue) {
      case Direction.DOWN:
        if (selectedSettingsIndex < settingsItems.length - 1) {
          setSelectedSettingsIndex((i) => i + 1);
        }
        break;
      case Direction.UP:
        if (selectedSettingsIndex > 0) {
          setSelectedSettingsIndex((i) => i - 1);
        }
        break;
      case ButtonType.A:
        switch (settingsItems[selectedSettingsIndex].key) {
          case SettingsKeys.SOUND:
            setSoundEnabled(!soundEnabled);
            break;
          case SettingsKeys.VIBRATION:
            setVibrationEnabled(!vibrationEnabled);
            break;
        }
        break;
      case ButtonType.B:
        setSettingsOpen(false);
        break;
    }
  };

  const handleInput = (inputValue: InputValue | null) => {
    setInput(inputValue);

    switch (inputValue) {
      case ButtonType.START:
        if (!power) {
          setPower(1);
        }
        return;
      case ButtonType.SELECT:
        if (power) setSettingsOpen(true);
        return;
    }

    if (settingsOpen && inputValue) {
      handleSettingsInput(inputValue);
    }
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
          <Breakout input={input} soundEnabled={soundEnabled} />
        )}
      </Screen>
      <div className="mt-4 min-[400px]:mt-6 text-center">
        <Trademark />
      </div>
      <div className="flex items-center justify-between mt-5">
        <DirectionalPad
          onPress={handleInput}
          dataTestId="directional-pad-button"
        />
        <div className="flex">
          <Button
            onPress={handleInput}
            value={ButtonType.B}
            className="mt-6 mr-6"
            dataTestId="b-button"
          />
          <Button
            onPress={handleInput}
            value={ButtonType.A}
            dataTestId="a-button"
          />
        </div>
      </div>
      <div className="flex justify-center mt-6 min-[400px]:mt-10">
        <Button
          onPress={handleInput}
          value={ButtonType.SELECT}
          dataTestId="select-button"
          type="flat"
        />
        <Button
          onPress={handleInput}
          value={ButtonType.START}
          className="ml-6"
          type="flat"
          dataTestId="start-button"
        />
      </div>
      <Speaker />
    </div>
  );
}

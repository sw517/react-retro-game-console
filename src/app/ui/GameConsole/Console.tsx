'use client';

import { useState } from 'react';
import { Direction, InputValue, Button as ButtonType } from '@/types/input';
import {
  SettingsItem,
  SettingsKeys,
  ConsoleColors,
  SettingsType,
} from '@/types/settings';
import { SettingsContext } from '@/app/contexts/SettingsContext';
import styles from './styles.module.scss';
import Button from './Button';
import DirectionalPad from './DirectionalPad';
import Screen from './Screen';
import Trademark from './Trademark';
import Breakout from '@/app/ui/Breakout/Breakout';
import Settings from '../Settings';
import Speaker from './Speaker';
import clsx from 'clsx';

export default function Console() {
  const [power, setPower] = useState<0 | 1>(0);
  const [input, setInput] = useState<InputValue | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedSettingsIndex, setSelectedSettingsIndex] = useState(0);
  const [selectedSettingsParentId, setSelectedSettingsParentId] = useState<
    SettingsItem['id'] | null
  >(null);
  const [settings, setSettings] = useState({
    [SettingsKeys.VIBRATION_ENABLED]: true,
    [SettingsKeys.SOUND_ENABLED]: true,
    [SettingsKeys.COLOR]: ConsoleColors.RED,
  });

  const allSettingsItems: SettingsItem[] = [
    {
      id: SettingsKeys.VIBRATION_ENABLED,
      type: SettingsType.TOGGLE,
      text: 'Vibration',
      key: SettingsKeys.VIBRATION_ENABLED,
      value: settings[SettingsKeys.VIBRATION_ENABLED],
    },
    {
      id: SettingsKeys.SOUND_ENABLED,
      type: SettingsType.TOGGLE,
      text: 'Sound',
      key: SettingsKeys.SOUND_ENABLED,
      value: settings[SettingsKeys.SOUND_ENABLED],
    },
    {
      id: SettingsKeys.COLOR,
      text: 'Console appearance',
      children: [
        {
          id: ConsoleColors.RED,
          type: SettingsType.SELECT,
          text: 'Red',
          key: SettingsKeys.COLOR,
          value: ConsoleColors.RED,
        },
        {
          id: ConsoleColors.PURPLE,
          type: SettingsType.SELECT,
          text: 'Purple',
          key: SettingsKeys.COLOR,
          value: ConsoleColors.PURPLE,
        },
        {
          id: ConsoleColors.YELLOW,
          type: SettingsType.SELECT,
          text: 'Yellow',
          key: SettingsKeys.COLOR,
          value: ConsoleColors.YELLOW,
        },
        {
          id: ConsoleColors.GREEN,
          type: SettingsType.SELECT,
          text: 'Green',
          key: SettingsKeys.COLOR,
          value: ConsoleColors.GREEN,
        },
        {
          id: ConsoleColors.TURQOISE,
          type: SettingsType.SELECT,
          text: 'Turqoise',
          key: SettingsKeys.COLOR,
          value: ConsoleColors.TURQOISE,
        },
      ],
    },
  ];

  const getSettingsItems = () => {
    if (!selectedSettingsParentId) return allSettingsItems;
    const items = allSettingsItems.find(
      ({ id }) => id === selectedSettingsParentId
    )?.children;
    return items || allSettingsItems;
  };

  const viewingSettingsItems = getSettingsItems();

  const handleSettingsInput = (inputValue: InputValue) => {
    switch (inputValue) {
      case Direction.DOWN:
        if (selectedSettingsIndex < viewingSettingsItems.length - 1) {
          setSelectedSettingsIndex((i) => i + 1);
        }
        break;
      case Direction.UP:
        if (selectedSettingsIndex > 0) {
          setSelectedSettingsIndex((i) => i - 1);
        }
        break;
      case ButtonType.A:
        const item = viewingSettingsItems[selectedSettingsIndex];
        if (item.key) {
          switch (item.key) {
            case SettingsKeys.SOUND_ENABLED:
            case SettingsKeys.VIBRATION_ENABLED:
              setSettings({
                ...settings,
                [item.key]: !item.value,
              });
              break;
            case SettingsKeys.COLOR:
              setSettings({
                ...settings,
                [item.key]: item.value as ConsoleColors,
              });
          }
        } else if (item.children) {
          setSelectedSettingsIndex(0);
          setSelectedSettingsParentId(item.id);
        }
        break;
      case ButtonType.B:
        if (selectedSettingsParentId) {
          const index = allSettingsItems.findIndex(
            ({ id }) => id === selectedSettingsParentId
          );
          setSelectedSettingsIndex(index === -1 ? 0 : index);
        } else {
          setSelectedSettingsIndex(0);
          setSettingsOpen(false);
        }
        setSelectedSettingsParentId(null);
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
    <div
      className={clsx([
        styles.console,
        styles[`console--${settings[SettingsKeys.COLOR]}`],
      ])}
    >
      <SettingsContext.Provider value={settings}>
        <Screen power={power}>
          {!!power && settingsOpen && (
            <Settings
              selectedIndex={selectedSettingsIndex}
              selectedParentId={selectedSettingsParentId}
              settingsItems={viewingSettingsItems}
            />
          )}
          {!!power && !settingsOpen && (
            <Breakout
              input={input}
              soundEnabled={settings[SettingsKeys.SOUND_ENABLED]}
            />
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
      </SettingsContext.Provider>
    </div>
  );
}

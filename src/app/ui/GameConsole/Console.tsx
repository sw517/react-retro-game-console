'use client';

import { useEffect, useState } from 'react';
import { InputValue, Button as ButtonType } from '@/types/input';
import { SettingsKeys, SettingsContextType } from '@/types/settings';
import {
  SettingsContext,
  defaultSettings,
} from '@/app/contexts/SettingsContext';
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsContextType>(() => {
    try {
      const stringifiedSettings = localStorage.getItem('settings');
      if (!stringifiedSettings) return defaultSettings;
      const parsedSettings = JSON.parse(stringifiedSettings);
      return parsedSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const callback = (input: InputValue) => {
      switch (input) {
        case ButtonType.START:
          if (!power) setPower(1);
          break;
        case ButtonType.SELECT:
          if (power) setSettingsOpen(true);
          break;
        default:
          break;
      }
    };
    window.emitter.on('input', callback);

    return () => {
      window.emitter.off('input', callback);
    };
  }, [power]);

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
              settings={settings}
              onUpdate={setSettings}
              onClose={() => setSettingsOpen(false)}
            />
          )}
          {!!power && !settingsOpen && (
            <Breakout soundEnabled={settings[SettingsKeys.SOUND_ENABLED]} />
          )}
        </Screen>
        <div className="mt-4 min-[400px]:mt-6 text-center">
          <Trademark />
        </div>
        <div className="flex items-center justify-between mt-5">
          <DirectionalPad dataTestId="directional-pad-button" />
          <div className="flex">
            <Button
              value={ButtonType.B}
              keyboardCode={['Escape', 'Backspace']}
              className="mt-6 mr-6"
              dataTestId="b-button"
            />
            <Button
              value={ButtonType.A}
              keyboardCode="Enter"
              dataTestId="a-button"
            />
          </div>
        </div>
        <div className="flex justify-center mt-6 min-[400px]:mt-10">
          <Button
            value={ButtonType.SELECT}
            keyboardCode="KeyC"
            dataTestId="select-button"
            type="flat"
          />
          <Button
            value={ButtonType.START}
            keyboardCode="Space"
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

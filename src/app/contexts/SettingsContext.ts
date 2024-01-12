import { createContext } from 'react';
import { ConsoleColors, SettingsKeys } from '@/types/settings';

export const defaultSettings = {
  [SettingsKeys.VIBRATION_ENABLED]: true,
  [SettingsKeys.SOUND_ENABLED]: true,
  [SettingsKeys.COLOR]: ConsoleColors.RED,
};

export const SettingsContext = createContext(defaultSettings);

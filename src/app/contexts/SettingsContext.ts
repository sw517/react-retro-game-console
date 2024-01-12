import { createContext } from 'react';
import { ConsoleColors, SettingsKeys } from '@/types/settings';

export const SettingsContext = createContext({
  [SettingsKeys.VIBRATION_ENABLED]: true,
  [SettingsKeys.SOUND_ENABLED]: true,
  [SettingsKeys.COLOR]: ConsoleColors.RED,
});

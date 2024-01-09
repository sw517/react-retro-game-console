export enum SettingsKeys {
  VIBRATION = 'vibration',
  SOUND = 'sound',
  APPEARANCE = 'appearance',
}

export enum ConsoleAppearanceKeys {
  RED = 'red',
  YELLOW = 'yellow',
  PURPLE = 'purple',
}

export type SettingsItem = {
  text: string;
  key: SettingsKeys | ConsoleAppearanceKeys;
  active?: boolean;
  childItems?: SettingsItem[];
};

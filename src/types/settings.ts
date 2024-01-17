export enum SettingsKeys {
  VIBRATION_ENABLED = 'vibration_enabled',
  SOUND_ENABLED = 'sound_enabled',
  COLOR = 'color',
}

export enum ConsoleColors {
  RED = 'red',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  TURQOISE = 'turqoise',
  GREEN = 'green',
}

export enum SettingsType {
  TOGGLE = 'toggle',
  SELECT = 'select',
}

export type SettingsItem = {
  id: string;
  text: string;
  key?: SettingsKeys;
  value?: boolean | ConsoleColors;
  children?: SettingsItem[];
  type?: SettingsType;
};

export type SettingsContextType = {
  [SettingsKeys.VIBRATION_ENABLED]: boolean;
  [SettingsKeys.SOUND_ENABLED]: boolean;
  [SettingsKeys.COLOR]: ConsoleColors;
};

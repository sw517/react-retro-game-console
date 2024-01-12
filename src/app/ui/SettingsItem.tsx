import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { SettingsItem, SettingsType } from '@/types/settings';
import clsx from 'clsx';

type props = {
  text: string;
  settingsKey?: SettingsItem['key'];
  value?: SettingsItem['value'];
  selected?: boolean;
  type: SettingsItem['type'];
  hasChildren?: boolean;
};

export default function SettingsItem({
  text,
  selected,
  value,
  type,
  settingsKey,
  hasChildren,
}: props) {
  const settings = useContext(SettingsContext);

  const showOnOff = type === SettingsType.TOGGLE;
  const active =
    (type === SettingsType.TOGGLE && value) ||
    (type === SettingsType.SELECT &&
      settingsKey &&
      settings[settingsKey] === value);

  return (
    <li
      className={clsx([
        'flex items-center justify-between px-2 py-1',
        selected && 'bg-neutral-400',
      ])}
    >
      {text}
      {hasChildren && <span>&gt;</span>}
      {!hasChildren && (
        <span className="flex items-center">
          {showOnOff && <span className="mr-2">{active ? 'on' : 'off'}</span>}
          <span
            className={clsx([
              'block w-2 h-2 rounded-full border-2 border-current',
              active && 'bg-current',
            ])}
          />
        </span>
      )}
    </li>
  );
}

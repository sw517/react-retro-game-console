import { SettingsItem as SettingsItemType } from '@/types/settings';
import SettingsItem from './SettingsItem';
import styles from '@/app/ui/styles.module.scss';
import clsx from 'clsx';

export default function Settings({
  selectedIndex,
  settingsItems,
}: {
  selectedIndex: number;
  settingsItems: SettingsItemType[];
}) {
  const items = [];
  for (let i = 0; i < settingsItems.length; i += 1) {
    items.push(
      <SettingsItem
        key={settingsItems[i].key}
        text={settingsItems[i].text}
        active={settingsItems[i].active}
        selected={selectedIndex === i}
        hasChildren={!!settingsItems[i].childItems?.length}
      />
    );
  }

  return (
    <div
      className={clsx([
        styles.settings,
        'flex flex-col bg-neutral-300 text-gray-700 w-full h-full font-bold',
      ])}
    >
      <ul className="flex-grow">{items}</ul>
      <div className="flex justify-between px-2 py-1 text-gray-700">
        <span>A = Select</span>
        <span>B = Back</span>
      </div>
    </div>
  );
}

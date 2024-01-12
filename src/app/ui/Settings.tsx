'use client';

import clsx from 'clsx';
import { SettingsItem as SettingsItemType } from '@/types/settings';
import SettingsItem from './SettingsItem';
import styles from '@/app/ui/styles.module.scss';
import useResponsive from '@/app/hooks/useResponsive';
import { useState, useEffect } from 'react';

export default function Settings({
  selectedIndex,
  settingsItems,
}: {
  selectedIndex: number;
  selectedParentId: SettingsItemType['id'] | null;
  settingsItems: SettingsItemType[];
}) {
  const { width: windowWidth } = useResponsive();

  const [pageCount, setPageCount] = useState(3);

  useEffect(() => {
    if (windowWidth >= 380) {
      setPageCount(5);
    } else {
      setPageCount(3);
    }
  }, [windowWidth]);

  const items = settingsItems.map((item, i) => (
    <SettingsItem
      key={item.id}
      settingsKey={item.key}
      text={item.text}
      value={item.value}
      type={item.type}
      selected={selectedIndex === i}
      hasChildren={!!item.children?.length}
    />
  ));

  const pages = Math.ceil(items.length / pageCount);
  const currentPage = Math.ceil((selectedIndex + 1) / pageCount);
  const hasPagesBefore = currentPage > 1;
  const hasPagesAfter = currentPage < pages;
  const startingPageIndex = (currentPage - 1) * pageCount;
  const itemsPaginated = items.slice(
    startingPageIndex,
    startingPageIndex + pageCount
  );

  return (
    <div
      className={clsx([
        styles.settings,
        'flex flex-col bg-neutral-300 text-gray-700 w-full h-full font-bold',
      ])}
    >
      <ul>{itemsPaginated}</ul>

      <div className="flex-grow relative">
        {pages > 1 && (
          <div className="absolute text-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className={hasPagesBefore ? 'text-black' : 'text-gray-400'}>
              ↑
            </span>
            <span className={hasPagesAfter ? 'text-black' : 'text-gray-400'}>
              ↓
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between px-2 py-1 text-gray-700">
        <span>A = Select</span>
        <span>B = Back</span>
      </div>
    </div>
  );
}

'use client';

import clsx from 'clsx';
import { useState, useEffect, useMemo } from 'react';
import {
  SettingsItem as SettingsItemType,
  SettingsKeys,
  ConsoleColors,
  SettingsType,
  SettingsContextType,
} from '@/types/settings';
import { Button, Direction } from '@/types/input';
import SettingsItem from './SettingsItem';
import styles from '@/app/ui/styles.module.scss';
import useResponsive from '@/app/hooks/useResponsive';
import { InputValue } from '@/types/input';

export default function Settings({
  settings,
  onUpdate,
  onClose,
}: {
  settings: SettingsContextType;
  onUpdate: (arg0: any) => void;
  onClose: () => void;
}) {
  const { width: windowWidth } = useResponsive();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedParentId, setSelectedParentId] = useState<
    SettingsItemType['id'] | null
  >(null);
  const [pageCount, setPageCount] = useState(3);

  useEffect(() => {
    if (windowWidth >= 380) {
      setPageCount(5);
    } else {
      setPageCount(3);
    }
  }, [windowWidth]);

  const allSettingsItems: SettingsItemType[] = useMemo(
    () => [
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
    ],
    [settings]
  );

  const getCurrentPageItems = () => {
    if (!selectedParentId) return allSettingsItems;
    const items = allSettingsItems.find(
      ({ id }) => id === selectedParentId
    )?.children;
    return items || allSettingsItems;
  };

  const currentPageItems = getCurrentPageItems();

  const pages = Math.ceil(currentPageItems.length / pageCount);
  const currentPage = Math.ceil((selectedIndex + 1) / pageCount);
  const hasPagesBefore = currentPage > 1;
  const hasPagesAfter = currentPage < pages;
  const startingPageIndex = (currentPage - 1) * pageCount;
  const itemsPaginated = currentPageItems.slice(
    startingPageIndex,
    startingPageIndex + pageCount
  );

  const itemElements = itemsPaginated.map((item, i) => (
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

  useEffect(() => {
    const callback = (input: InputValue) => {
      switch (input) {
        case Direction.DOWN:
          if (selectedIndex < currentPageItems.length - 1) {
            setSelectedIndex((i) => i + 1);
          }
          break;
        case Direction.UP:
          if (selectedIndex > 0) {
            setSelectedIndex((i) => i - 1);
          }
          break;
        case Button.A:
          const item = currentPageItems[selectedIndex];
          if (item.key) {
            switch (item.key) {
              case SettingsKeys.SOUND_ENABLED:
              case SettingsKeys.VIBRATION_ENABLED:
                onUpdate({
                  ...settings,
                  [item.key]: !item.value,
                });
                break;
              case SettingsKeys.COLOR:
                onUpdate({
                  ...settings,
                  [item.key]: item.value as ConsoleColors,
                });
            }
          } else if (item.children) {
            setSelectedIndex(0);
            setSelectedParentId(item.id);
          }
          break;
        case Button.B:
          if (selectedParentId) {
            const index = allSettingsItems.findIndex(
              ({ id }) => id === selectedParentId
            );
            setSelectedIndex(index === -1 ? 0 : index);
          } else {
            setSelectedIndex(0);
            onClose();
          }
          setSelectedParentId(null);
          break;
      }
    };
    window.emitter.on('input', callback);
    return () => {
      window.emitter.off('input', callback);
    };
  }, [
    allSettingsItems,
    currentPageItems,
    onClose,
    onUpdate,
    selectedIndex,
    selectedParentId,
    settings,
  ]);

  return (
    <div
      className={clsx([
        styles.settings,
        'flex flex-col bg-neutral-300 text-gray-700 w-full h-full font-bold',
      ])}
    >
      <ul>{itemElements}</ul>

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

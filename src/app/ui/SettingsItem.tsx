import clsx from 'clsx';

type props = {
  text: string;
  active?: boolean;
  selected?: boolean;
  hasChildren?: boolean;
};

export default function SettingsItem({
  text,
  selected,
  active,
  hasChildren,
}: props) {
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
          <span className="mr-2">{active ? 'on' : 'off'}</span>
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

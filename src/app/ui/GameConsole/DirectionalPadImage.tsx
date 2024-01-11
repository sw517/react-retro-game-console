import styles from './styles.module.scss';
import clsx from 'clsx';
import { Direction } from '@/types/input';

const borderColor = '#000';
const buttonColor = '#333';
const arrowColor = '#222';

export default function DirectionalPadImage({
  directionPressed,
}: {
  directionPressed?: Direction | null;
}) {
  return (
    <svg data-testid="directional-pad" viewBox="0 0 100 100" overflow="visible">
      <defs>
        <filter id="shadow">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="3"
            floodColor={borderColor}
          />
        </filter>

        <clipPath id="directional-arrows-clip-path">
          {/* Horizontal */}
          <rect x="1" y="34" width="98" height="32" rx="4" />
          {/* Vertical */}
          <rect x="34" y="1" width="32" height="98" rx="4" />
        </clipPath>
        <clipPath id="directional-arrows-clip-path-border">
          {/* Horizontal */}
          <rect x="0" y="33" width="100" height="34" rx="5" />
          {/* Vertical */}
          <rect x="33" y="0" width="34" height="100" rx="5" />
        </clipPath>

        <clipPath id="triangle-up" clipPathUnits="objectBoundingBox">
          <polygon points="0.5,0.2 0.8,0.8 0.2,0.8" />
        </clipPath>

        <clipPath id="triangle-right" clipPathUnits="objectBoundingBox">
          <polygon points="0.8,0.5 0.2,0.8 0.2,0.2" />
        </clipPath>

        <clipPath id="triangle-down" clipPathUnits="objectBoundingBox">
          <polygon points="0.5,0.8 0.8,0.2 0.2,0.2" />
        </clipPath>

        <clipPath id="triangle-left" clipPathUnits="objectBoundingBox">
          <polygon points="0.2,0.5 0.8,0.8 0.8,0.2" />
        </clipPath>
      </defs>

      {/* Border */}
      <rect
        width="100"
        height="100"
        fill={buttonColor}
        clipPath="url(#directional-arrows-clip-path-border)"
      />
      {/* Directional Buttons */}
      <g
        className={clsx([
          styles['d-pad-image'],
          directionPressed &&
            styles[`d-pad-image--pressed-${directionPressed}`],
        ])}
      >
        <g filter='url("#shadow")'>
          <rect
            width="100"
            height="100"
            fill="#333"
            clipPath="url(#directional-arrows-clip-path)"
          />
        </g>
        <rect
          data-testid="up-arrow"
          width="32"
          height="32"
          x="34"
          y="1"
          fill={arrowColor}
          clipPath="url(#triangle-up)"
        />
        <rect
          data-testid="right-arrow"
          width="32"
          height="32"
          x="67"
          y="34"
          fill={arrowColor}
          clipPath="url(#triangle-right)"
        />
        <rect
          data-testid="down-arrow"
          width="32"
          height="32"
          x="34"
          y="67"
          fill={arrowColor}
          clipPath="url(#triangle-down)"
        />
        <rect
          data-testid="left-arrow"
          width="32"
          height="32"
          x="1"
          y="34"
          fill={arrowColor}
          clipPath="url(#triangle-left)"
        />
      </g>
    </svg>
  );
}

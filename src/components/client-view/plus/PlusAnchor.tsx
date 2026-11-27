import type { CSSProperties } from "react";

interface Props {
  /** unique name, only for debugging */
  name: string;
  /** size multiplier relative to the slot (default 1) */
  scale?: number;
  /** resting orientation in degrees [x, y, z] */
  rot?: readonly [number, number, number];
  /** idle float amplitude in px (default 6) */
  float?: number;
  style?: CSSProperties;
}

/**
 * Invisible placeholder that reserves the space of a "+" (like the old glyph did).
 * The shared 3D plus flies here when the scroll reaches it. Put it right after a number / heading.
 */
export default function PlusAnchor({ name, scale, rot, float, style }: Props) {
  return (
    <span
      aria-hidden
      data-plus-anchor={name}
      data-plus-scale={scale}
      data-plus-rot={rot?.join(",")}
      data-plus-float={float}
      style={{ display: "inline-block", width: "0.66em", height: "0.74em", marginLeft: "0.05em", verticalAlign: "baseline", ...style }}
    />
  );
}

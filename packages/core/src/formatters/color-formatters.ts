import { INVALID_PLACEHOLDER } from './formatter-general-utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HSV {
  h: number; // 0–360
  s: number; // 0–1
  v: number; // 0–1
}

export interface RGB {
  r: number; // 0–255
  g: number; // 0–255
  b: number; // 0–255
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function toHexComponent(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n)))
    .toString(16)
    .padStart(2, '0');
}

function isValidHexString(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

// ---------------------------------------------------------------------------
// Color formatting namespace
// ---------------------------------------------------------------------------

/**
 * Color formatting namespace.
 * Stateless conversion helpers for hex, RGB, and HSV colour representations.
 */
export const color = {
  /** "#ff5900" → { r, g, b } */
  hexToRgb(hex: string): RGB {
    if (!isValidHexString(hex)) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  },

  /** (r, g, b) → "#ff5900" */
  rgbToHex({ r, g, b }: RGB): string {
    return `#${toHexComponent(r)}${toHexComponent(g)}${toHexComponent(b)}`;
  },

  /** (r, g, b) → { h, s, v } */
  rgbToHsv({ r, g, b }: RGB): HSV {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const d = max - min;

    let h = 0;
    if (d !== 0) {
      if (max === rn) h = ((gn - bn) / d + 6) % 6;
      else if (max === gn) h = (bn - rn) / d + 2;
      else h = (rn - gn) / d + 4;
      h *= 60;
    }

    const s = max === 0 ? 0 : d / max;
    return { h, s, v: max };
  },

  /** { h, s, v } → { r, g, b } */
  hsvToRgb({ h, s, v }: HSV): RGB {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0,
      g = 0,
      b = 0;
    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b = x;
    } else if (h < 240) {
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  },

  /** "#ff5900" → { h, s, v } */
  hexToHsv(hex: string): HSV {
    return color.rgbToHsv(color.hexToRgb(hex));
  },

  /** { h, s, v } → "#ff5900" */
  hsvToHex(hsv: HSV): string {
    return color.rgbToHex(color.hsvToRgb(hsv));
  },

  /** Returns true when hex is a valid 6-digit hex colour (e.g. "#a3f0c1") */
  isValidHex(hex: string): boolean {
    return isValidHexString(hex);
  },

  /** Clamp a string-encoded integer to [min, max] */
  clampInt(val: string, min: number, max: number): number {
    const n = parseInt(val, 10);
    if (isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  },

  /** Returns INVALID_PLACEHOLDER for unrecognised values */
  formatHex(hex: string): string {
    if (!isValidHexString(hex)) return INVALID_PLACEHOLDER;
    return hex.toUpperCase();
  },
};

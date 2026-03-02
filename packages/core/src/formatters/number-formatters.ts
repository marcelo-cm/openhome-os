import {
  INVALID_PLACEHOLDER,
  createCachedIntlGetter,
  isValidNumber,
  toNumber,
  toNumberNullable,
} from './formatter-general-utils';
import type {
  NumberInput,
  NumberInputNullable,
} from './formatter-general-utils';

export { toNumber, toNumberNullable, isValidNumber };
export type { NumberInput, NumberInputNullable };

const getNF = createCachedIntlGetter<
  Intl.NumberFormatOptions,
  Intl.NumberFormat
>((locale, opts) => new Intl.NumberFormat(locale, opts));

const ordinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' });
const ordinalSuffixes: Record<Intl.LDMLPluralRule, string> = {
  zero: 'th',
  one: 'st',
  two: 'nd',
  few: 'rd',
  other: 'th',
  many: 'th',
};

/**
 * Number formatting namespace.
 * All methods accept number | string and return a formatted string.
 */
export const number = {
  /** 1234567 → "1,234,567" */
  grouped(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    return getNF({ useGrouping: true }).format(num);
  },

  /** 1500 → "1.5K", 2500000 → "2.5M" */
  compact(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    return getNF({ notation: 'compact', maximumFractionDigits: 1 }).format(num);
  },

  /** 0.156 → "16%" */
  percent(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    return getNF({ style: 'percent', maximumFractionDigits: 0 }).format(num);
  },

  /** 0.1567 → "15.7%" */
  percentPrecise(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    return getNF({ style: 'percent', maximumFractionDigits: 1 }).format(num);
  },

  /** 1234.5 → "$1,234.50" */
  usd(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    return getNF({ style: 'currency', currency: 'USD' }).format(num);
  },

  /** 1234.5 → "$1234.5" — simple prefix */
  price(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    return `$${num}`;
  },

  /** 1234.5678 → "1,234.57" */
  decimal(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    return getNF({ minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      num,
    );
  },

  /** 5 → "5th", 1 → "1st" */
  ordinal(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    const rounded = Math.round(num);
    return `${rounded}${ordinalSuffixes[ordinalRules.select(rounded)]}`;
  },

  /** 1024 → "1 KB", 1048576 → "1 MB" */
  fileSize(bytes: NumberInput) {
    const num = toNumber(bytes);
    if (!isValidNumber(num) || num < 0) return INVALID_PLACEHOLDER;
    if (num === 0) return '0 Bytes';

    const k = 1024;
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

    const i = Math.min(
      units.length - 1,
      Math.floor(Math.log(num) / Math.log(k)),
    );
    const value = num / k ** i;

    const nf = getNF({
      maximumFractionDigits: i === 0 ? 0 : 2,
      minimumFractionDigits: 0,
    });
    return `${nf.format(value)} ${units[i]}`;
  },

  /** 5 → "+5", -3 → "-3", 0 → "0" */
  signed(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    return getNF({ signDisplay: 'exceptZero' }).format(num);
  },

  /** "v1_2" → "v2" */
  version(v: string) {
    const num = Number(v.split('_')[1]);
    return isValidNumber(num) ? `v${num}` : v;
  },

  /** 15000 → "15k", 2500000 → "2.5M" — for view counts */
  views(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;

    if (num >= 1_000_000) {
      const val = num / 1_000_000;
      return val >= 10 ? `${Math.floor(val)}M` : `${val.toFixed(1)}M`;
    }
    if (num >= 1_000) {
      const val = num / 1_000;
      return val >= 10 ? `${Math.floor(val)}k` : `${val.toFixed(1)}k`;
    }
    return num.toString();
  },

  /**
   * 1234 → "1.234s"
   * 500 → "500ms"
   */
  latency(n: NumberInput) {
    const num = toNumber(n);
    if (!isValidNumber(num)) return INVALID_PLACEHOLDER;
    if (num < 1000) return `${num.toFixed(0)}ms`;
    return `${(num / 1000).toFixed(2)}s`;
  },
} as const;

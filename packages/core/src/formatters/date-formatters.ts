import {
  INVALID_PLACEHOLDER,
  createCachedIntlGetter,
  isValidDate,
  toDate,
  toDateNullable,
} from './formatter-general-utils';
import type { DateInput, DateInputNullable } from './formatter-general-utils';

export { toDate, toDateNullable, isValidDate };
export type { DateInput, DateInputNullable };

const getDTF = createCachedIntlGetter<
  Intl.DateTimeFormatOptions,
  Intl.DateTimeFormat
>((locale, opts) => new Intl.DateTimeFormat(locale, opts));

const getRTF = createCachedIntlGetter<
  Intl.RelativeTimeFormatOptions,
  Intl.RelativeTimeFormat
>((locale, opts) => new Intl.RelativeTimeFormat(locale ?? 'en', opts));

/**
 * Date formatting namespace.
 * All methods accept Date | string | number and return a formatted string.
 * String inputs without timezone indicators are automatically treated as UTC.
 */
export const date = {
  /** "Jan 15, 2024" */
  short(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    return getDTF({ year: 'numeric', month: 'short', day: 'numeric' }).format(
      dt,
    );
  },

  /** "Jan 15, 2024" — formatted in UTC timezone */
  shortUTC(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    return getDTF({
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(dt);
  },

  /** "January 15, 2024" */
  long(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    return getDTF({ year: 'numeric', month: 'long', day: 'numeric' }).format(
      dt,
    );
  },

  /** "1/15/24" */
  numeric(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    return getDTF({ year: '2-digit', month: 'numeric', day: 'numeric' }).format(
      dt,
    );
  },

  /** "Jan 15" */
  monthDay(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    return getDTF({ month: 'short', day: 'numeric' }).format(dt);
  },

  /** "3:45 PM" */
  time(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    return getDTF({ hour: 'numeric', minute: '2-digit', hour12: true }).format(
      dt,
    );
  },

  /** "15:45" */
  time24(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    return getDTF({ hour: '2-digit', minute: '2-digit', hour12: false }).format(
      dt,
    );
  },

  /** "Jan 15, 2024 • 3:45 PM" — local timezone */
  dateTime(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    const dateStr = getDTF({
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dt);
    const timeStr = getDTF({
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(dt);
    return `${dateStr} • ${timeStr}`;
  },

  /** "PST" */
  timezone() {
    const parts = getDTF({ timeZoneName: 'short' }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  },

  /** "Jan 15, 2024 • 3:45 PM" — UTC timezone */
  dateTimeUTC(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    const dateStr = getDTF({
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(dt);
    const timeStr = getDTF({
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    }).format(dt);
    return `${dateStr} • ${timeStr}`;
  },

  /** "2 days ago", "in 3 hours", "yesterday", "tomorrow" — full relative time */
  relative(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;

    const diffSeconds = Math.floor((Date.now() - dt.getTime()) / 1000);

    if (Math.abs(diffSeconds) < 60) return 'just now';

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
      ['year', 365 * 24 * 60 * 60],
      ['month', 30 * 24 * 60 * 60],
      ['week', 7 * 24 * 60 * 60],
      ['day', 24 * 60 * 60],
      ['hour', 60 * 60],
      ['minute', 60],
    ];

    for (const [unit, secondsInUnit] of units) {
      if (Math.abs(diffSeconds) >= secondsInUnit) {
        const value = Math.floor(Math.abs(diffSeconds) / secondsInUnit);
        return getRTF({ style: 'long', numeric: 'auto' }).format(
          diffSeconds < 0 ? value : -value,
          unit,
        );
      }
    }

    return 'just now';
  },

  /** "2d", "18h", "9m" — compact relative time */
  relativeCompact(d: DateInput) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;

    const diffSeconds = Math.floor((Date.now() - dt.getTime()) / 1000);

    if (Math.abs(diffSeconds) < 60) return 'now';

    const units: [string, number][] = [
      ['y', 365 * 24 * 60 * 60],
      ['mo', 30 * 24 * 60 * 60],
      ['w', 7 * 24 * 60 * 60],
      ['d', 24 * 60 * 60],
      ['h', 60 * 60],
      ['m', 60],
    ];

    for (const [unit, secondsInUnit] of units) {
      if (Math.abs(diffSeconds) >= secondsInUnit) {
        const value = Math.floor(Math.abs(diffSeconds) / secondsInUnit);
        return `${value}${unit}`;
      }
    }

    return 'now';
  },

  /** ISO string or null */
  toISO(d: DateInput): string {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;
    return dt.toISOString();
  },

  /** Unix timestamp (seconds) or NaN */
  toUnix(d: DateInput): number {
    const dt = toDate(d);
    if (!isValidDate(dt)) return NaN;
    return Math.floor(dt.getTime() / 1000);
  },

  /** "Jan 15, 2024 - Jan 20, 2024" */
  range({ start, end }: { start: DateInput; end: DateInput }) {
    return `${date.short(start)} - ${date.short(end)}`;
  },

  /** "2h 15m 30s" — returns "0s" if end is null (incomplete/ongoing) */
  duration({ start, end }: { start: DateInput; end: DateInputNullable }) {
    const startDt = toDate(start);
    if (!isValidDate(startDt)) return INVALID_PLACEHOLDER;

    if (end == null) return '0s';

    const endDt = toDate(end);
    if (!isValidDate(endDt)) return INVALID_PLACEHOLDER;

    let totalSeconds = Math.floor((endDt.getTime() - startDt.getTime()) / 1000);
    if (totalSeconds < 0) return INVALID_PLACEHOLDER;

    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - minutes * 60;

    const parts: string[] = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
  },

  durationMs({ start, end }: { start: DateInput; end: DateInputNullable }) {
    const startDt = toDate(start);
    if (!isValidDate(startDt)) return 0;
    if (end === null || end === undefined) return 0;
    const endDt = toDate(end);
    if (!isValidDate(endDt)) return 0;
    return endDt.getTime() - startDt.getTime();
  },

  /** 3665 → "1h 1m 5s" */
  fromSeconds(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return INVALID_PLACEHOLDER;

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts: string[] = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) {
      parts.push(seconds < 60 ? `${s.toFixed(2)}s` : `${Math.floor(s)}s`);
    }
    return parts.join(' ');
  },

  /** "Jan 15, 2024 PST" — with timezone abbreviation */
  withTZ({ date: d, timeZone }: { date: DateInput; timeZone: string }) {
    const dt = toDate(d);
    if (!isValidDate(dt)) return INVALID_PLACEHOLDER;

    const base = getDTF({
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone,
    }).format(dt);
    try {
      const parts = getDTF({ timeZone, timeZoneName: 'short' }).formatToParts(
        dt,
      );
      const tz = parts.find((p) => p.type === 'timeZoneName')?.value;
      return tz ? `${base} ${tz}` : base;
    } catch {
      return base;
    }
  },
} as const;

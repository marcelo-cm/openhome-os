/**
 * Shared utilities for formatter modules.
 * These helpers provide caching, input normalization, and validation.
 */

// =============================================================================
// Cache Utilities
// =============================================================================

/** Stable key for Intl options objects (sorted keys, stringified values). */
export function stableKeyFromOptions(opts?: Record<string, unknown>): string {
  if (!opts) return '';
  return Object.keys(opts)
    .sort()
    .map((k) => `${k}:${String(opts[k])}`)
    .join('|');
}

/** FIFO cap for Map caches (Map preserves insertion order). */
export function capFifoCache<K, V>(cache: Map<K, V>, maxSize: number): void {
  while (cache.size > maxSize) {
    const firstKey = cache.keys().next().value as K | undefined;
    if (firstKey === undefined) break;
    cache.delete(firstKey);
  }
}

/**
 * Creates a cached getter for Intl formatter instances.
 * Handles cache key generation and FIFO eviction automatically.
 *
 * @param factory - Function that creates the Intl formatter
 * @param maxSize - Maximum cache size (default: 200)
 * @returns A function that returns cached formatter instances
 */
export function createCachedIntlGetter<TOptions, TFormatter>(
  factory: (locale: string | undefined, opts?: TOptions) => TFormatter,
  maxSize = 200,
): (opts?: TOptions, locale?: string) => TFormatter {
  const cache = new Map<string, TFormatter>();

  return (opts?: TOptions, locale?: string) => {
    const key = `${locale ?? 'default'}::${stableKeyFromOptions(opts as Record<string, unknown>)}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const fmt = factory(locale, opts);
    cache.set(key, fmt);
    capFifoCache(cache, maxSize);
    return fmt;
  };
}

// =============================================================================
// Date Input Coercion
// =============================================================================

/** Date coercion input type - strict, does not accept null/undefined. */
export type DateInput = Date | string | number;

/** Date input type that accepts null/undefined for cases where it's explicitly expected. */
export type DateInputNullable = DateInput | null | undefined;

const TZ_OFFSET_PATTERN = /[+-]\d{2}(:?\d{2})?$/;

/**
 * Ensures a date string is treated as UTC if no timezone indicator exists.
 * This prevents JavaScript from interpreting timezone-less strings as local time.
 * Only handles valid ISO 8601 formats; invalid strings will fail naturally in new Date().
 */
function ensureUTC(dateString: string): string {
  if (dateString.endsWith('Z') || dateString.endsWith('GMT')) {
    return dateString;
  }

  if (TZ_OFFSET_PATTERN.test(dateString)) {
    return dateString;
  }

  return `${dateString}Z`;
}

/**
 * Coerces input to a Date object.
 * String inputs without timezone indicators are treated as UTC.
 */
export function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'string') return new Date(ensureUTC(input));
  return new Date(input);
}

/**
 * Coerces nullable input to a Date object.
 * Null/undefined inputs return an invalid Date (detected by isValidDate).
 */
export function toDateNullable(input: DateInputNullable): Date {
  if (input === null) return new Date(NaN);
  if (input === undefined) return new Date(NaN);
  return toDate(input);
}

/** Checks if a Date is valid. */
export function isValidDate(d: Date): boolean {
  return !Number.isNaN(d.getTime());
}

// =============================================================================
// Number Input Coercion
// =============================================================================

/** Number coercion input type - strict, does not accept null/undefined. */
export type NumberInput = number | string;

/** Number input type that accepts null/undefined for cases where it's explicitly expected. */
export type NumberInputNullable = NumberInput | null | undefined;

/** Coerces input to a number. */
export function toNumber(input: NumberInput): number {
  return typeof input === 'number' ? input : Number(input);
}

/**
 * Coerces nullable input to a number.
 * Null/undefined inputs return NaN (detected by isValidNumber).
 */
export function toNumberNullable(input: NumberInputNullable): number {
  if (input === null) return NaN;
  if (input === undefined) return NaN;
  return toNumber(input);
}

/** Checks if a number is finite (valid for formatting). */
export function isValidNumber(n: number): boolean {
  return Number.isFinite(n);
}

// =============================================================================
// String Input Coercion
// =============================================================================

/** String coercion input type - strict, does not accept null/undefined. */
export type StringInput = string;

/** String input type that accepts null/undefined for cases where it's explicitly expected. */
export type StringInputNullable = StringInput | null | undefined;

/** Coerces input to a string, returning null for empty values. */
export function safeString(input: StringInput): string | null {
  if (input === '') return null;
  return input;
}

/** Coerces nullable input to a string, returning null for empty/invalid values. */
export function safeStringNullable(input: StringInputNullable): string | null {
  if (input === null) return null;
  if (input === undefined) return null;
  if (input === '') return null;
  return input;
}

// =============================================================================
// Constants
// =============================================================================

/** Placeholder for invalid/missing values. */
export const INVALID_PLACEHOLDER = '—';

import {
  INVALID_PLACEHOLDER,
  createCachedIntlGetter,
  safeString,
  safeStringNullable,
} from './formatter-general-utils';
import type {
  StringInput,
  StringInputNullable,
} from './formatter-general-utils';

export { safeString, safeStringNullable };
export type { StringInput, StringInputNullable };

const getListFormat = createCachedIntlGetter<
  Intl.ListFormatOptions,
  Intl.ListFormat
>((locale, opts) => new Intl.ListFormat(locale ?? 'en', opts));

const getPluralRules = createCachedIntlGetter<
  Intl.PluralRulesOptions,
  Intl.PluralRules
>((locale, opts) => new Intl.PluralRules(locale ?? 'en', opts));

/**
 * String formatting namespace.
 * All methods accept string | null | undefined and return a formatted string.
 */
export const string = {
  /** "hello_world" → "Hello World"
   * "Marcelo's server" → "Marcelo's Server"
   */
  titleCase(s: StringInput) {
    const str = safeString(s);
    /**
     * If it's an invalid string, return an empty string instead of INVALID_PLACEHOLDER, contrary to most other methods.
     */
    if (!str) return '';
    return str
      .replace(/_/g, ' ')
      .replace(/(^|\s)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
  },

  /** "hello_world" → "Hello world" */
  sentenceCase(s: StringInput) {
    const str = safeString(s);
    if (!str) return INVALID_PLACEHOLDER;
    const spaced = str.replace(/_/g, ' ').toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  },

  /** "hello world" → "Hello world" */
  capitalize(s: StringInput) {
    const str = safeString(s);
    if (!str) return INVALID_PLACEHOLDER;
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /** "message-circle" → "MessageCircle" (kebab-case to PascalCase) */
  pascalCase(s: StringInput) {
    const str = safeString(s);
    if (!str) return '';
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  },

  /** ["a", "b", "c"] → "a, b, and c" */
  joinAnd(parts: string[]) {
    return getListFormat({ style: 'long', type: 'conjunction' }).format(parts);
  },

  /** ["a", "b", "c"] → "a, b, or c" */
  joinOr(parts: string[]) {
    return getListFormat({ style: 'long', type: 'disjunction' }).format(parts);
  },

  /** "apple" → "an", "banana" → "a" */
  article(word: StringInput) {
    const str = safeString(word);
    if (!str) return 'a';
    const first = str.trim().toLowerCase().charAt(0);
    return ['a', 'e', 'i', 'o', 'u'].includes(first) ? 'an' : 'a';
  },

  /** "apple" → "an apple" */
  withArticle(word: StringInput) {
    const str = safeString(word);
    if (!str) return INVALID_PLACEHOLDER;
    return `${string.article(str)} ${str}`;
  },

  /** (2, "item") → "items" */
  pluralize({
    count,
    singular,
    plural,
  }: {
    count: number;
    singular: string;
    plural?: string;
  }) {
    const rule = getPluralRules().select(count);
    return rule === 'one' ? singular : (plural ?? `${singular}s`);
  },

  /** (2, "item") → "2 items" */
  countOf({
    count,
    singular,
    plural,
  }: {
    count: number;
    singular: string;
    plural?: string;
  }) {
    return `${count} ${string.pluralize({ count, singular, plural })}`;
  },

  /** "my_server_name" → "My Server Name" */
  toolName(name: StringInput) {
    const str = safeString(name);
    if (!str) return '';
    return str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  },

  toAlphanumeric(s: StringInput) {
    const str = safeString(s);
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  },
} as const;

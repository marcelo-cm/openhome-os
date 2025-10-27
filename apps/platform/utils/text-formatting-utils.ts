export function prettifyText(text: string) {
  return text
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Capitalize the first letter of each word in the text
 * @param text - The text to capitalize
 * @returns The capitalized text
 */
export function titleCase(text: string | undefined) {
  if (text === undefined || text.length === 0) return text;

  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatMonth(month: number) {
  return new Date(0, month).toLocaleString('en-US', { month: 'long' });
}

export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  },
) {
  return date.toLocaleString('en-US', options);
}

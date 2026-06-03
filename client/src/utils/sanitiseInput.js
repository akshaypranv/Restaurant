/**
 * Sanitises client-side input string by stripping HTML tags and trimming.
 * @param {string} input 
 * @returns {string} sanitised string
 */
export function sanitiseInput(input) {
  if (typeof input !== 'string') return '';
  // Strip HTML tags using simple regex
  return input
    .replace(/<[^>]*>/g, '')
    .trim();
}

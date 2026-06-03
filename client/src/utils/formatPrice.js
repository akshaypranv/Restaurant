/**
 * Formats a single price or dual prices into the Indian Rupee format.
 * @param {number} price 
 * @param {number|null} priceAlt 
 * @param {string|null} priceLabel 
 * @returns {string} formatted price string
 */
export function formatPrice(price, priceAlt = null, priceLabel = null) {
  const format = (num) => {
    return `₹${Number(num).toFixed(0)}`;
  };

  if (priceAlt !== null && priceAlt !== undefined) {
    return `${format(price)} / ${format(priceAlt)}`;
  }

  return format(price);
}

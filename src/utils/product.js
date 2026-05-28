export function parseRooftopItems(product) {
  if (!product?.rooftop_items) return [];
  if (Array.isArray(product.rooftop_items)) return product.rooftop_items;
  try {
    const parsed = JSON.parse(product.rooftop_items);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isRooftopProduct(product) {
  return product?.product_type === "rooftop";
}

export function isFeedAdActive(product) {
  if (!product?.is_highlight) return false;
  if (!product.highlight_expires_at) return false;
  return new Date(product.highlight_expires_at).getTime() >= Date.now();
}

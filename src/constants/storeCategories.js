export const STORE_CATEGORIES = [
  { value: "supplier", label: "Supplier" },
  { value: "petani", label: "Petani" },
  { value: "transportir", label: "Transportir" }
];

export function getStoreCategoryLabel(value) {
  return STORE_CATEGORIES.find((c) => c.value === value)?.label || "";
}

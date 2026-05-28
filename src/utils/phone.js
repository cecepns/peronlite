export const normalizeWhatsAppPhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
};

export const buildWhatsAppUrl = (phone, message = "") => {
  const normalized = normalizeWhatsAppPhone(phone);
  if (!normalized) return "";
  const base = `https://wa.me/${normalized}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
};

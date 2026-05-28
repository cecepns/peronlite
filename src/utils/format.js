export const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

export const stripHtml = (value = "") => value.replace(/<[^>]*>/g, "").trim();

export const getInitial = (name = "") => (name.trim()[0] || "T").toUpperCase();

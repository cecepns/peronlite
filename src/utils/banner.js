import { formatRupiah } from "./format";

export const formatBannerPackageLabel = (item) =>
  `Banner tayang ${item.duration_days} hari · ${formatRupiah(item.price)}`;

export const isTextBanner = (banner) => !banner?.image && Boolean(String(banner?.description || "").trim());

export const BANNER_REQUEST_STATUS = {
  pending: "Menunggu persetujuan admin",
  approved: "Disetujui",
  rejected: "Ditolak"
};

export const formatPremiumPackageLabel = (item) =>
  `${item.duration_days} hari aktif · ${formatRupiah(item.price)}`;

export const formatFeedPackageLabel = (item) =>
  `Feed ${item.duration_days} hari · ${formatRupiah(item.price)}`;

export const PREMIUM_REQUEST_STATUS = BANNER_REQUEST_STATUS;

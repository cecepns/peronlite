import { BASE_URL } from "./api";

export const resolveImageUrl = (value = "") => (value?.startsWith("http") ? value : `${BASE_URL}/${value}`);

export const isPdfPath = (value = "") => /\.pdf$/i.test(String(value).split("?")[0]);

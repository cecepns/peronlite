import axios from "axios";

// export const BASE_URL = import.meta.env.VITE_API_URL || "https://api.lokaljasa.com";
export const BASE_URL = import.meta.env.VITE_API_URL || "https://api.kingcreativestudio.my.di/peronlite";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 20000
});

if (import.meta.env.DEV) {
  console.log("[API] BASE_URL =", BASE_URL);
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      const url = (error.config?.baseURL || "") + (error.config?.url || "");
      console.log("[API ERROR]", error.message, "→", url);
    }
    return Promise.reject(error);
  }
);

export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;

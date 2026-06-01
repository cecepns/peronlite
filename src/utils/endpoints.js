export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register"
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    BECOME_SELLER: (id) => `/users/${id}/become-seller`,
    PREMIUM: (id) => `/users/${id}/premium`,
    DELETE: (id) => `/users/${id}`
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`
  },
  CATEGORIES: {
    LIST: "/categories",
    CREATE: "/categories",
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`
  },
  STORE: {
    DETAIL: (userId) => `/store/${userId}`,
    CREATE: "/store",
    UPDATE: (id) => `/store/${id}`
  },
  BANNERS: "/banners",
  BANNER_PRICELIST: "/banner-pricelist",
  PREMIUM_PRICELIST: "/premium-pricelist",
  FEED_PRICELIST: "/feed-pricelist",
  SELLER_STATS: "/seller/stats",
  ANNOUNCEMENTS: {
    ACTIVE: "/announcements/active",
    LIST: "/announcements",
    DETAIL: (id) => `/announcements/${id}`
  },
  SELLER_REQUESTS: {
    LIST: "/seller-requests",
    MINE: "/seller-requests/mine",
    CREATE: "/seller-requests",
    UPDATE: (id) => `/seller-requests/${id}`,
    DELETE: (id) => `/seller-requests/${id}`
  },
  TERMS: "/terms",
  ADMIN: {
    CONTACT: "/admin/contact",
    PAYMENT_QRIS: "/admin/payment-qris",
    PAYMENT_QRIS_DELETE: (type) => `/admin/payment-qris/${type}`,
    STATS: "/admin/stats",
    PRODUCTS: "/admin/products",
    FEED_ADS: "/admin/feed-ads",
    FEED_AD: (id) => `/admin/feed-ads/${id}`
  },
  REGIONS: {
    ALL_REGENCIES: "/regions/all-regencies",
    PROVINCES: "/regions/provinces",
    REGENCIES: (code) => `/regions/regencies/${code}`,
    DISTRICTS: (code) => `/regions/districts/${code}`,
    VILLAGES: (code) => `/regions/villages/${code}`
  }
};

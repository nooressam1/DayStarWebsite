export const ENDPOINTS = {
  PRODUCT: {
    BY_SLUG: (slug: string) => `/product/${slug}`,
    LIST: "/product",
    VARIANTS: (productId: string) => `/product/${productId}/variants`,
    REVIEWS: (productId: string) => `/product/${productId}/reviews`,
    BEST_SELLERS: "/product/best-sellers",
  },
  DISCOUNT: {
    GET: (code: string) => `/discount/${code}`,
  },
  CATEGORY: {
    LIST: "/category",
  },
  ORDER: {
    CHECKOUT: "/orders/checkout",
    GET: (id: string) => `/orders/${id}`,
    LIST: "/orders",
    CANCEL: (orderId: string) => `/orders/${orderId}/cancel`,
  },
  USER: {
    ME: "/me",
  },
  ADDRESS: {
    LIST_OR_CREATE: "/addresses",
    BY_ID: (id: string) => `/addresses/${id}`,
    SET_DEFAULT: (id: string) => `/addresses/${id}/default`,
  },
  CONTACT: {
    SUBMIT: "/contact_submissions",
  },
  QUIZ: {
    SUBMIT: "/quiz/submit",
  },
} as const;

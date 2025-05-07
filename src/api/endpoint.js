const endpoints = {
  auth: {
    login: '/users/login',
    register: '/users/register',
    logout: '/users/logout',
    forgotPassword: '/users/forgot-password',
    getProfile: '/users/me',
    changePassword: '/users/change-password',
    verifyOTP: '/users/verify-otp',
  },
  user: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    getAll: '/users',
    createUser: '/users',
    deactivateUser: (id) => `/users/${id}`,
    activateUser: (id) => `/users/${id}/activate`,
  },
  cart: {
    getCart: '/cart',
    addToCart: '/cart',
    updateCartItem: (cartItemId, quantity) => `/cart/${cartItemId}?quantity=${quantity}`,
    removeCartItem: (cartItemId) => `/cart/${cartItemId}`,
    clearCart: '/cart'
  },
  checkout: {
    getCheckoutInfo: '/checkout',
    processCheckout: '/checkout/deposit',
    paymentCallback: '/payment/vn-pay-callback',
    verifyPayment: (preorderId) => `/remaining-amount/${preorderId}`
  },
  preorders: {
    getHistory: '/preorders',
    getDetails: (id) => `/preorders/${id}`
  },
  product: {
    getAllProducts: '/products', 
    getProductById: (id) => `/products/${id}`,
    createProduct: '/products',
    rateProduct: (id, rating) => `/products/${id}/rate?rating=${rating}`,
    updateProduct: (id) => `/products/${id}`,
    deleteProduct: (id) => `/products/${id}`,
  },
  category: {
    getAll: '/categories',
    getById: (id) => `/categories/${id}`,
    create: '/categories',
    update: (id) => `/categories/${id}`,
    delete: (id) => `/categories/${id}`
  }
};
  
export default endpoints;
import axiosInstance from "./axios.js";
import endpoints from "./endpoint.js";

const cartService = {
    getUserCart: async () => {
        const response = await axiosInstance.get(endpoints.cart.getCart);
        return response.data;
    },

    addItemToCart: async (data) => {
        const response = await axiosInstance.post(endpoints.cart.addToCart, data);
        return response.data;
    },

    updateCartItemQuantity: async (cartItemId, quantity) => {
        const response = await axiosInstance.put(endpoints.cart.updateCartItem(cartItemId, quantity));
        return response.data;
    },

    removeCartItem: async (cartItemId) => {
        const response = await axiosInstance.delete(endpoints.cart.removeCartItem(cartItemId));
        return response.data;
    },

    clearCart: async () => {
        const response = await axiosInstance.delete(endpoints.cart.clearCart);
        return response.data;
    },
};

export default cartService;
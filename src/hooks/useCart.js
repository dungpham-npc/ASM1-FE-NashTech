import { useCallback, useState, useEffect } from 'react';
import cartService from '../api/cartService.js';
import { message } from 'antd';

const useCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            const response = await cartService.getUserCart();
            if (response.code === '200') {
                setCart(response.data);
            } else {
                throw new Error('Failed to fetch cart');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch cart');
            message.error(err.message || 'Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = useCallback(async (productId, quantity) => {
        setLoading(true);
        try {
            const response = await cartService.addItemToCart({ productId, quantity });
            if (response.code === '200') {
                setCart(response.data);
                message.success('Item added to cart successfully');
            } else {
                throw new Error('Failed to add item to cart');
            }
        } catch (err) {
            message.error(err.message || 'Failed to add item to cart');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCartItemQuantity = useCallback(async (cartItemId, quantity) => {
        setLoading(true);
        try {
            const response = await cartService.updateCartItemQuantity(cartItemId, quantity);
            if (response.code === '200') {
                setCart(response.data);
                message.success('Cart item quantity updated successfully');
            } else {
                throw new Error('Failed to update cart item quantity');
            }
        } catch (err) {
            message.error(err.message || 'Failed to update cart item quantity');
        } finally {
            setLoading(false);
        }
    }, []);

    const removeFromCart = useCallback(async (cartItemId) => {
        setLoading(true);
        try {
            const response = await cartService.removeCartItem(cartItemId);
            if (response.code === '200') {
                setCart(response.data);
                message.success('Item removed from cart successfully');
            } else {
                throw new Error('Failed to remove item from cart');
            }
        } catch (err) {
            message.error(err.message || 'Failed to remove item from cart');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCart = useCallback(async () => {
        setLoading(true);
        try {
            const response = await cartService.clearCart();
            if (response.code === '200') {
                setCart(response.data);
                message.success('Cart cleared successfully');
            } else {
                throw new Error('Failed to clear cart');
            }
        } catch (err) {
            message.error(err.message || 'Failed to clear cart');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        cart,
        loading,
        error,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
    };
};

export default useCart;
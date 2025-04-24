import { useCallback } from 'react';

const useCart = () => {
    const notifyComingSoon = useCallback(() => {
        alert('🛒 Cart functionality coming soon!');
    }, []);

    return {
        addToCart: notifyComingSoon,
        removeFromCart: notifyComingSoon,
        clearCart: notifyComingSoon,
        getCart: () => {
            alert('🛒 Cart functionality coming soon!');
            return [];
        },
    };
};

export default useCart;

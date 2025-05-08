import React, { useState } from 'react';
import { Typography, Button, InputNumber, Empty, Spin, Divider, Modal } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import useCart from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const cloudinaryBaseUrl = 'https://res.cloudinary.com/dftip4xgy/image/upload/';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, loading, error, updateCartItemQuantity, removeFromCart, clearCart } = useCart();
    const [isClearModalVisible, setIsClearModalVisible] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);

    const handleQuantityChange = (cartItemId, value) => {
        if (value >= 1) {
            updateCartItemQuantity(cartItemId, value);
        }
    };

    const handleClearCart = async () => {
        await clearCart();
        setIsClearModalVisible(false);
    };

    const confirmRemoveItem = (itemId) => {
        setItemToRemove(itemId);
        setIsRemoveModalVisible(true);
    };

    const handleRemoveItem = async () => {
        if (itemToRemove) {
            await removeFromCart(itemToRemove);
            setItemToRemove(null);
        }
        setIsRemoveModalVisible(false);
    };

    if (loading && !cart) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (error && !cart) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center my-8">
                <p className="text-lg font-medium">{error}</p>
                <Button className="mt-4" onClick={() => navigate('/dashboard/products')}>
                    Return to Products
                </Button>
            </div>
        );
    }

    const emptyCart = !cart || !cart.cartItems || cart.cartItems.length === 0;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <Title level={2} className="mb-2 text-center font-semibold text-gray-800">
                    Your Shopping Cart
                </Title>
                <Text className="text-center block mb-8 text-gray-500">
                    {emptyCart ? 'Your cart is empty' : `You have ${cart.cartItems.length} item(s) in your cart`}
                </Text>

                {emptyCart ? (
                    <Empty
                        description={null}
                        className="my-16"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <div className="text-center mt-4">
                            <p className="text-gray-500 mb-6">Your shopping cart is empty. Add some products to get started!</p>
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingOutlined />}
                                onClick={() => navigate('/dashboard/products')}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    </Empty>
                ) : (
                    <>
                        <div className="mb-6">
                            {cart.cartItems.map(item => (
                                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 border-b border-gray-200 py-6">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                        <img
                                            alt={item.product.name}
                                            src={
                                                item.product.thumbnailImgKey && item.product.thumbnailImgKey !== 'null.jpg'
                                                    ? `${cloudinaryBaseUrl}/${item.product.thumbnailImgKey}`
                                                    : 'https://placehold.co/300x300'
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <div className="flex flex-col md:flex-row md:justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-800">{item.product.name}</h3>
                                                <p className="text-sm text-gray-500">{item.product.category.name}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0 text-right">
                                                <p className="text-sm text-gray-600">Price per item</p>
                                                <p className="font-medium">
                                                    {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {    /* Quantity Control */}
                                    <div className="flex items-center gap-2">
                                        <Text className="text-sm text-gray-600 w-16">Quantity:</Text>
                                        <div className="flex items-center">
                                            <Button
                                                size="small"
                                                onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                                className="flex items-center justify-center w-8 h-8"
                                            >
                                                -
                                            </Button>
                                            <InputNumber
                                                min={1}
                                                value={item.quantity}
                                                onChange={(value) => handleQuantityChange(item.id, value)}
                                                className="w-12 mx-1"
                                                controls={false}
                                            />
                                            <Button
                                                size="small"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="flex items-center justify-center w-8 h-8"
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Total & Remove */}
                                    <div className="flex items-center justify-between w-full md:w-auto">
                                        <div className="md:mr-6">
                                            <p className="text-sm text-gray-600">Total</p>
                                            <p className="font-semibold text-green-600">
                                                {item.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </p>
                                        </div>
                                        <Button
                                            icon={<DeleteOutlined />}
                                            danger
                                            onClick={() => confirmRemoveItem(item.id)}
                                            className="flex items-center"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Divider />

                        {/* Order Summary */}
                        <div className="my-6 p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Order Summary</h3>

                            <div className="flex justify-between mb-2">
                                <Text>Subtotal:</Text>
                                <Text>{cart.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                            </div>

                            <div className="flex justify-between mb-2">
                                <Text>Shipping:</Text>
                                <Text>Calculated at checkout</Text>
                            </div>

                            <Divider className="my-3" />

                            <div className="flex justify-between">
                                <Text className="text-lg font-bold">Total:</Text>
                                <Text className="text-lg font-bold text-green-600">
                                    {cart.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </Text>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row justify-between mt-8">
                            <Button
                                onClick={() => setIsClearModalVisible(true)}
                                className="mb-4 md:mb-0"
                                disabled={loading}
                            >
                                Clear Cart
                            </Button>

                            <div className="flex gap-4">
                                <Button onClick={() => navigate('/dashboard/products')}>
                                    Continue Shopping
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => navigate('/dashboard/checkout')}
                                    icon={<ArrowRightOutlined />}
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Modal
                title="Confirm Clear Cart"
                open={isClearModalVisible}
                onCancel={() => setIsClearModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsClearModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="clear" type="primary" danger onClick={handleClearCart}>
                        Clear
                    </Button>,
                ]}
            >
                <p>Are you sure you want to clear your cart? This action cannot be undone.</p>
            </Modal>

            <Modal
                title="Remove Item"
                open={isRemoveModalVisible}
                onCancel={() => setIsRemoveModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsRemoveModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="remove" type="primary" danger onClick={handleRemoveItem}>
                        Remove
                    </Button>,
                ]}
            >
                <p>Are you sure you want to remove this item from your cart?</p>
            </Modal>
        </div>
    );
};

export default Cart;
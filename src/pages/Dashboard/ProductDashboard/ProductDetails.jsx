import React, { useState, useEffect } from 'react';
import {Modal, Row, Col, Image, Tag, Spin, Alert, Divider} from 'antd';
import productService from "../../../api/productService.js";
import 'react-quill/dist/quill.snow.css';

const ProductDetails = ({ visible, onClose, id }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch product details when visible or id changes
    useEffect(() => {
        let mounted = true;

        const fetchProductDetails = async () => {
            if (!id || !visible) return;

            setLoading(true);
            setError(null);

            try {
                const response = await productService.getProductById(id);
                if (response.code === '200' && mounted) {
                    setProduct(response.data);
                } else {
                    throw new Error('Failed to fetch product details');
                }
            } catch (err) {
                if (mounted) {
                    setError(err.message || 'Failed to fetch product details');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchProductDetails();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            mounted = false;
        };
    }, [id, visible]);

    // Render loading state
    if (loading) {
        return (
            <Modal
                title="Product Details"
                visible={visible}
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <div className="flex items-center justify-center h-64">
                    <Spin size="large" tip="Loading product details..." />
                </div>
            </Modal>
        );
    }

    // Render error state
    if (error) {
        return (
            <Modal
                title="Product Details"
                visible={visible}
                onCancel={onClose}
                footer={[
                    <Button key="close" onClick={onClose}>
                        Close
                    </Button>,
                ]}
                width={800}
            >
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    className="mb-4"
                />
            </Modal>
        );
    }

    // Render product details
    return (
        <Modal
            title="Product Details"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {product ? (
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        {product.imageKeys && product.imageKeys.length > 0 ? (
                            product.imageKeys.map((key, index) => (
                                <Image
                                    key={index}
                                    src={`https://res.cloudinary.com/dftip4xgy/image/upload/${key}`}
                                    alt={product.name}
                                    className="w-full h-64 object-cover mb-4 rounded"
                                />
                            ))
                        ) : (
                            <Image src="https://placehold.co/300x300" alt="No Image" className="w-full h-64 object-cover mb-4 rounded" />
                        )}
                    </Col>
                    <Col span={12}>
                        <h2 className="text-xl font-bold">{product.name}</h2>
                        <Divider />
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Description:</h3>
                            {product.description ? (
                                <div className="quill-content">
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            ) : (
                                <p className="text-gray-500">No description available</p>
                            )}
                        </div>
                        <Divider />
                        <p className="mt-2">
                            Price: {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                        <p className="mt-2">
                            Category: {product.category?.name || 'Uncategorized'}
                        </p>
                        <p className="mt-2">
                            Featured: <Tag color={product.isFeatured ? 'green' : 'default'}>{product.isFeatured ? 'Yes' : 'No'}</Tag>
                        </p>
                        <p className="mt-2">
                            Rating: {product.averageRating || 'N/A'} / 5
                        </p>
                        <p className="mt-2">
                            Created: {new Date(product.createdAt).toLocaleString()}
                        </p>
                        <p className="mt-2">
                            Updated: {new Date(product.updatedAt).toLocaleString()}
                        </p>
                    </Col>
                </Row>
            ) : null}
        </Modal>
    );
};

export default ProductDetails;
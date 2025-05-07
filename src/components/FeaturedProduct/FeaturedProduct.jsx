import { useEffect, useState } from 'react';
import { Card, Skeleton, Button, Typography } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import productService from "../../api/productService.js";

const { Title } = Typography;

const FeaturedProduct = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/dftip4xgy/image/upload/';
    const [currentIndex, setCurrentIndex] = useState(0);
    const productsToShow = 4;

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            setLoading(true);
            try {
                const response = await productService.getAllProducts({
                    isFeatured: true,
                    sort: 'updatedAt,desc'
                });
                if (response && response.code === '200' && response.data) {
                    setFeaturedProducts(response.data.content || []);
                } else {
                    setError('Failed to fetch featured products');
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const handleViewProduct = (id) => {
        navigate(`/product/${id}`);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? Math.max(0, featuredProducts.length - productsToShow) : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= featuredProducts.length - productsToShow ? 0 : prevIndex + 1
        );
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + ' ₫';
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-12">
                <div className="container mx-auto px-4">
                    <Title level={2} className="text-red-600 mb-6">NEW ARRIVALS</Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <Card key={index} className="border rounded-lg overflow-hidden shadow-md">
                                <Skeleton.Image className="w-full h-64" active />
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || featuredProducts.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-red-50 via-white to-blue-100 py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <Title level={2} className="text-red-600 m-0 font-bold">FEATURED</Title>
                    <Button
                        type="link"
                        className="text-gray-800 hover:text-red-600 font-medium"
                        onClick={() => navigate('/?isFeatured=true')}
                    >
                        More &gt;
                    </Button>
                </div>

                <div className="relative bg-white bg-opacity-70 backdrop-blur-md p-4 rounded-lg shadow-lg">
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-red-100 rounded-full p-2 shadow"
                        onClick={handlePrev}
                    >
                        <LeftOutlined className="text-gray-600" />
                    </button>

                    <div className="flex overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / productsToShow)}%)` }}
                        >
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="min-w-[25%] px-3">
                                    <Card
                                        hoverable
                                        className="border rounded-lg overflow-hidden shadow-md"
                                        onClick={() => handleViewProduct(product.id)}
                                        cover={
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                                <img
                                                    alt={product.name}
                                                    src={
                                                        product.thumbnailImgKey && product.thumbnailImgKey !== 'null.jpg'
                                                            ? `${cloudinaryBaseUrl}/${product.thumbnailImgKey}`
                                                            : 'https://placehold.co/300x300'
                                                    }
                                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                                />
                                            </div>
                                        }
                                        bodyStyle={{ padding: '16px' }}
                                    >
                                        <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2">{product.name}</h3>
                                        <p className="text-red-600 font-bold">
                                            {formatPrice(product.price)}
                                        </p>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-red-100 rounded-full p-2 shadow"
                        onClick={handleNext}
                    >
                        <RightOutlined className="text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProduct;

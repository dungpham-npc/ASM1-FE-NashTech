import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Row,
    Col,
    Breadcrumb,
    Skeleton,
    Image,
    Typography,
    Divider,
    InputNumber,
    Button,
    message,
    Tabs,
    Alert,
    Empty,
    Rate,
    Tag,
} from "antd";
import {
    HomeOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
} from "@ant-design/icons";
import productService from "../../api/productService.js";
import useCart from "../../hooks/useCart.js";
import useAuth from "../../hooks/useAuth.js";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [favorite, setFavorite] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

    // Fetch product details on component mount
    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productService.getProductById(id);
                console.log("Product detail response:", response);
                if (response && response.code === "200" && response.data) {
                    setProduct(response.data);
                } else {
                    setError("Failed to load product details");
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError(err.message || "An error occurred while fetching product details");
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleQuantityChange = (value) => {
        setQuantity(value);
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            message.warning("Please login to add items to cart");
            navigate("/login");
            return;
        }

        setAddingToCart(true);
        try {
            const success = await addToCart(id, quantity);
            if (success) {
                message.success(`Added ${quantity} item(s) to cart`);
            }
        } catch (err) {
            console.error("Error adding to cart:", err);
            message.error(err.message || "Failed to add to cart. Please try again.");
        } finally {
            setAddingToCart(false);
        }
    };

    const toggleFavorite = () => {
        setFavorite(!favorite);
        message.success(favorite ? "Removed from wishlist" : "Added to wishlist");
    };

    const handleImageSelect = (index) => {
        setSelectedImage(index);
    };

    // If there's an error, show error message with option to go back
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Breadcrumb className="mb-6">
                    <Breadcrumb.Item>
                        <Link to="/">
                            <HomeOutlined /> Home
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/">All Products</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Error</Breadcrumb.Item>
                </Breadcrumb>
                <Alert
                    message="Error Loading Details"
                    description={
                        <div>
                            <p>{error}</p>
                            <div className="mt-4">
                                <Button
                                    type="primary"
                                    onClick={() => navigate("/")}
                                    className="mr-4"
                                >
                                    Back to all products
                                </Button>
                                <Button onClick={() => window.location.reload()}>
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    }
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-6">
                <Breadcrumb.Item>
                    <Link to="/">
                        <HomeOutlined /> Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/">All Products</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    {loading ? "Loading..." : product?.name || "Product Detail"}
                </Breadcrumb.Item>
            </Breadcrumb>

            {/* Product Detail */}
            {loading ? (
                <Row gutter={[48, 24]}>
                    <Col xs={24} md={12}>
                        <Skeleton.Image className="w-full h-96" />
                    </Col>
                    <Col xs={24} md={12}>
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </Col>
                </Row>
            ) : (
                product && (
                    <>
                        <Row gutter={[48, 24]}>
                            <Col xs={24} md={12}>
                                <div className="bg-gray-50 p-8 rounded-lg">
                                    <Image
                                        src={
                                            product.imageKeys && product.imageKeys.length > 0
                                                ? `https://res.cloudinary.com/dftip4xgy/image/upload/${product.imageKeys[selectedImage]}`
                                                : "https://placehold.co/600x600?text=No+Image"
                                        }
                                        alt={product.name}
                                        className="w-full object-contain"
                                        fallback="https://placehold.co/600x600?text=No+Image"
                                    />
                                </div>

                                {/* Image gallery */}
                                {product.imageKeys && product.imageKeys.length > 0 && (
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                        {product.imageKeys.map((imageKey, index) => (
                                            <div
                                                key={index}
                                                className={`w-24 h-24 flex-shrink-0 bg-gray-50 rounded cursor-pointer hover:opacity-75 transition-opacity ${
                                                    selectedImage === index ? "border-2 border-blue-500" : ""
                                                }`}
                                                onClick={() => handleImageSelect(index)}
                                            >
                                                <img
                                                    src={
                                                        imageKey
                                                            ? `https://res.cloudinary.com/dftip4xgy/image/upload/${imageKey}`
                                                            : "https://placehold.co/100x100"
                                                    }
                                                    alt={`Product view ${index + 1}`}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Col>

                            <Col xs={24} md={12}>
                                <Title level={2}>{product.name}</Title>

                                {/* Category, ID, and rating */}
                                <div className="mb-4">
                                    <Text type="secondary">Product ID: {product.id}</Text>
                                    <div className="mt-2 flex gap-2 items-center">
                                        <Tag color="blue">{product.category?.name || "Uncategorized"}</Tag>
                                        <Rate
                                            disabled
                                            allowHalf
                                            value={parseFloat(product.averageRating || 0)}
                                            className="text-xs mr-2"
                                        />
                                        <Text type="secondary">
                                            ({parseFloat(product.averageRating || 0).toFixed(1)} / 5)
                                        </Text>
                                    </div>
                                </div>

                                {/* Price Display */}
                                <div className="price-display mb-6">
                                    <Title level={3} className="text-red-600 mb-0">
                                        {Number(product.price || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </Title>
                                </div>

                                <Divider />

                                {/* Description */}
                                <div className="mb-6">
                                    <Title level={4}>Description</Title>
                                    <Paragraph>
                                        {product.description || "No description available for this product."}
                                    </Paragraph>
                                </div>

                                <Divider />

                                {/* Add to cart section */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Text>Quantity:</Text>
                                        <InputNumber
                                            min={1}
                                            max={100} // Arbitrary max since quantity isn't available in API
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                        />
                                        <Text type="secondary">
                                            In stock (assumed)
                                        </Text>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            type="primary"
                                            icon={<ShoppingCartOutlined />}
                                            size="large"
                                            onClick={handleAddToCart}
                                            className="bg-black hover:bg-gray-800 flex-1"
                                            loading={addingToCart}
                                            disabled={addingToCart}
                                        >
                                            {addingToCart ? "Adding..." : "Add to Cart"}
                                        </Button>
                                        <Button
                                            icon={
                                                favorite ? (
                                                    <HeartOutlined className="text-red-500" />
                                                ) : (
                                                    <HeartOutlined />
                                                )
                                            }
                                            size="large"
                                            onClick={toggleFavorite}
                                            className={favorite ? "border-red-200" : ""}
                                        />
                                    </div>

                                    {!isAuthenticated && (
                                        <div className="mt-3">
                                            <Text type="secondary">
                                                <Link to="/login">Sign in</Link> to save items in your cart
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>

                        {/* Additional Product Information */}
                        <div className="mt-12">
                            <Tabs defaultActiveKey="details">
                                <TabPane tab="Product Details" key="details">
                                    <div className="p-6 bg-gray-50 rounded-lg">
                                        <Title level={4} className="mb-4">
                                            Product Specifications
                                        </Title>
                                        <Row gutter={[24, 16]}>
                                            <Col xs={24} sm={12} md={8}>
                                                <Text strong>Product Name:</Text>
                                                <div>{product.name}</div>
                                            </Col>
                                            <Col xs={24} sm={12} md={8}>
                                                <Text strong>Product ID:</Text>
                                                <div>{product.id}</div>
                                            </Col>
                                            <Col xs={24} sm={12} md={8}>
                                                <Text strong>Price:</Text>
                                                <div>{Number(product.price || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                            </Col>
                                            <Col xs={24} sm={12} md={8}>
                                                <Text strong>Category:</Text>
                                                <div>{product.category?.name || "Uncategorized"}</div>
                                            </Col>
                                            <Col xs={24} sm={12} md={8}>
                                                <Text strong>Average Rating:</Text>
                                                <div>{parseFloat(product.averageRating || 0).toFixed(1)} / 5</div>
                                            </Col>
                                        </Row>
                                    </div>
                                </TabPane>
                                <TabPane tab="Shipping & Returns" key="shipping">
                                    <div className="p-6 bg-gray-50 rounded-lg">
                                        <Title level={4} className="mb-4">
                                            Shipping Information
                                        </Title>
                                        <Paragraph>
                                            All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
                                        </Paragraph>

                                        <Title level={4} className="mt-6 mb-4">
                                            Return Policy
                                        </Title>
                                        <Paragraph>
                                            We offer a 14-day return policy for unopened items in their original packaging. Please contact our customer service team to initiate a return.
                                        </Paragraph>
                                    </div>
                                </TabPane>
                                <TabPane tab="Reviews" key="reviews">
                                    <div className="p-6 bg-gray-50 rounded-lg text-center">
                                        <p>No reviews yet for this product.</p>
                                        <Button type="primary" className="mt-4">
                                            Be the first to review
                                        </Button>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default ProductDetails;
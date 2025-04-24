import {useEffect, useState, useRef} from 'react';
import {Card, Row, Col, Input, Button, Skeleton, Empty, Pagination, Rate} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {useNavigate, useSearchParams} from 'react-router-dom';
import useProduct from "../../hooks/useProduct.js";
import ProductCategories from "../../components/ProductCategories/ProductCategories.jsx";

const Product = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialMount = useRef(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('productName') || '');
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/dftip4xgy/image/upload/'

    const {
        productData, pagination, loading, error, searchByName, changePage, resetSearch, filterByCategory
    } = useProduct({
        productName: searchParams.get('productName') || undefined,
        page: parseInt(searchParams.get('page') || '0'),
        size: parseInt(searchParams.get('size') || '12'),
    });

    // Reset search on mount
    useEffect(() => {
        if (initialMount.current) {
            initialMount.current = false;
            if (searchParams.toString()) {
                resetSearch();
                setSearchTerm('');
                setSearchParams({});
            }
        }
    }, [resetSearch, searchParams, setSearchParams]);

    // Update URL when search or pagination changes
    useEffect(() => {
        const newParams = new URLSearchParams();
        if (searchTerm) newParams.set('productName', searchTerm);
        newParams.set('page', pagination.current - 1);
        newParams.set('size', pagination.pageSize);
        setSearchParams(newParams, {replace: true});
    }, [searchTerm, pagination.pageSize, setSearchParams, pagination]);

    const handleSearch = () => {
        searchByName(searchTerm);
    };

    const handleViewDetails = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="max-w-8xl mx-auto px-12 py-8 flex gap-6">
            <div className="hidden md:block w-1/5">
                <div className="sticky top-20 max-h-[80vh] overflow-y-auto">
                    <ProductCategories onCategorySelect={filterByCategory}/>
                </div>
            </div>

            {/*Products Section*/}
            <div className="w-full md:w-4/5">
                <h1 className="text-3xl font-bold mb-6">Products</h1>

                {/* Search Bar */}
                <div className="mb-6 items-center">
                    <Input
                        placeholder="Search products"
                        prefix={<SearchOutlined/>}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                        style={{width: 300, marginRight: 8}}
                    />
                    <Button type="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </div>

                {/* Results Count */}
                <p className="text-gray-500 mb-6">
                    Showing {productData.length > 0 ? (pagination.current - 1) * pagination.pageSize + 1 : 0}-
                    {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} items
                </p>

                {/* Error Display */}
                {error && (<div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                    {error}
                    {/* eslint-disable-next-line no-undef */}
                    <Button type="link" onClick={() => refetch(searchParams)} className="ml-2">
                        Try again
                    </Button>
                </div>)}

                {/* Product Grid */}
                {loading ? (<Row gutter={[16, 16]}>
                    {[...Array(pagination.pageSize)].map((_, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${index}`}>
                            <Card>
                                <Skeleton active paragraph={{rows: 2}}/>
                            </Card>
                        </Col>))}
                </Row>) : productData.length > 0 ? (<>
                    <Row gutter={[16, 16]}>
                        {productData.map((product) => (<Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                            <Card
                                hoverable
                                cover={
                                    <div className="aspect-[3/4] overflow-hidden rounded-md">
                                        <img
                                            alt={product.name}
                                            src={
                                                product.thumbnailImgKey && product.thumbnailImgKey !== 'null.jpg'
                                                    ? `${cloudinaryBaseUrl}/${product.thumbnailImgKey}`
                                                    : 'https://placehold.co/300x300'
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                }
                                bodyStyle={{padding: '12px'}}
                                onClick={() => handleViewDetails(product.id)}
                            >
                                <div className="text-sm font-medium mb-1 line-clamp-2 h-10">{product.name}</div>
                                <div className="text-lg font-semibold text-red-600">
                                    {product.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}
                                </div>
                                <div className="flex items-center mt-1">
                                    <Rate
                                        disabled
                                        allowHalf
                                        defaultValue={parseFloat(product.averageRating)}
                                        className="text-xs text-yellow-400 mr-2"
                                    />
                                    <span className="ml-3 text-xs text-gray-500">
                                            ({parseFloat(product.averageRating).toFixed(1)} / 5)
                                        </span>
                                </div>
                            </Card>
                        </Col>))}
                    </Row>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                current={pagination.current}
                                total={pagination.total}
                                pageSize={pagination.pageSize}
                                onChange={(page) => {
                                    changePage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                showSizeChanger={false}
                                showQuickJumper
                            />
                        </div>

                    )}
                </>) : (<Empty
                    description={<span>
              No products found
                        {searchTerm && <span> matching "<strong>{searchTerm}</strong>"</span>}
            </span>}
                />)}
            </div>
        </div>
    );
};

export default Product;
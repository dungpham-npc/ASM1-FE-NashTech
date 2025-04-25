import {useEffect, useState, useRef} from 'react';
import {Card, Row, Col, Skeleton, Empty, Pagination, Rate} from 'antd';
import {useNavigate, useSearchParams} from 'react-router-dom';
import useProduct from "../../hooks/useProduct.js";
import ProductCategories from "../../components/ProductCategories/ProductCategories.jsx";
import FeaturedProduct from "../../components/FeaturedProduct/FeaturedProduct.jsx";

const Product = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/dftip4xgy/image/upload/'

    const {
        productData, pagination, loading, error, changePage, filterByCategory, searchByName
    } = useProduct({
        productName: searchParams.get('productName') || undefined,
        page: parseInt(searchParams.get('page') || '0'),
        size: parseInt(searchParams.get('size') || '12'),
    });

    useEffect(() => {
        // This will trigger the API call when the productName in URL changes
        searchByName(searchParams.get('productName') || undefined);
    }, [searchParams, searchByName]);

    const handleViewDetails = (id) => {
        navigate(`/product/${id}`);
    };

    const isSearching = !!searchParams.get('productName');

    return (
        <>
            {!isSearching && <FeaturedProduct />}

            <div className="max-w-8xl mx-auto px-12 py-8 flex gap-6">
                <div className="hidden md:block w-1/5">
                    <div className="sticky top-20 max-h-[80vh] overflow-y-auto">
                        <ProductCategories onCategorySelect={filterByCategory}/>
                    </div>
                </div>

                {/*Products Section*/}
                <div className="w-full md:w-4/5">
                    <h1 className="text-3xl font-bold mb-6">Products</h1>

                    {/* Results Count */}
                    <p className="text-gray-500 mb-6">
                        Showing {productData.length > 0 ? (pagination.current - 1) * pagination.pageSize + 1 : 0}-
                        {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} items
                        {searchParams.get('productName') &&
                            <span> matching "<strong>{searchParams.get('productName')}</strong>"</span>
                        }
                    </p>

                    {/* Error Display */}
                    {error && (<div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                        {error}
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
                                        // Update URL when page changes
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('page', page - 1);
                                        navigate({
                                            pathname: '/',
                                            search: newParams.toString()
                                        });

                                        // Change page in hook
                                        changePage(page);

                                        // Scroll to top
                                        window.scrollTo({top: 0, behavior: 'smooth'});
                                    }}
                                    showSizeChanger={false}
                                    showQuickJumper
                                />
                            </div>
                        )}
                    </>) : (<Empty
                        description={<span>
                      No products found
                            {searchParams.get('productName') &&
                                <span> matching "<strong>{searchParams.get('productName')}</strong>"</span>
                            }
                    </span>}
                    />)}
                </div>
            </div>
        </>
    );
};

export default Product;
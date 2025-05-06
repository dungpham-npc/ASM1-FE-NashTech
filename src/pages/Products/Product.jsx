import { useEffect, useState } from 'react';
import {Card, Row, Col, Skeleton, Empty, Pagination, Rate, Input, Select, Slider, Button, Divider} from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useProduct from "../../hooks/useProduct.js";
import ProductCategories from "../../components/ProductCategories/ProductCategories.jsx";
import FeaturedProduct from "../../components/FeaturedProduct/FeaturedProduct.jsx";

const { Option } = Select;

const Product = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/dftip4xgy/image/upload/';

    const [priceRange, setPriceRange] = useState([
        parseFloat(searchParams.get('minPrice')) || 0,
        parseFloat(searchParams.get('maxPrice')) || 10000000
    ]);

    const {
        productData,
        pagination,
        loading,
        error,
        changePage,
        filterByCategory,
        searchByName,
        updateFilters,
        resetFilters,
    } = useProduct({
        productName: searchParams.get('productName') || undefined,
        minPrice: parseFloat(searchParams.get('minPrice')) || undefined,
        maxPrice: parseFloat(searchParams.get('maxPrice')) || undefined,
        sort: searchParams.get('sort') || 'id,desc',
        page: parseInt(searchParams.get('page') || '0'),
        size: parseInt(searchParams.get('size') || '12'),
    });

    useEffect(() => {
        searchByName(searchParams.get('productName') || undefined);
    }, [searchParams, searchByName]);

    const handleViewDetails = (id) => {
        navigate(`/product/${id}`);
    };

    const handleSearch = (value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('productName', value);
        } else {
            newParams.delete('productName');
        }
        newParams.set('page', '0');
        setSearchParams(newParams);
    };

    const handleSortChange = (value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', value);
        newParams.set('page', '0');
        setSearchParams(newParams);
        updateFilters({ sort: value });
    };

    const handlePriceRangeChange = (value) => {
        setPriceRange(value);
    };

    const applyPriceFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('minPrice', priceRange[0]);
        newParams.set('maxPrice', priceRange[1]);
        newParams.set('page', '0');
        setSearchParams(newParams);
        updateFilters({
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
        });
    };

    const handleResetFilters = () => {
        setPriceRange([0, 10000000]);
        const newParams = new URLSearchParams();
        newParams.set('page', '0');
        newParams.set('size', '12');
        setSearchParams(newParams);
        resetFilters();
    };

    const isSearching = !!searchParams.get('productName');

    return (
        <>
            {!isSearching && <FeaturedProduct />}

            <div className="max-w-8xl mx-auto px-12 py-8 flex gap-6">
                <div className="hidden md:block w-1/5">
                    <div className="sticky top-20 max-h-[80vh] overflow-y-auto">
                        <Card className="mb-5 p-4 shadow-md rounded-xl">
                            <div className="flex flex-col lg:flex-row lg:items-end gap-6 flex-wrap">

                                {/* Sort Select */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Sort By</label>
                                    <Select
                                        defaultValue={searchParams.get('sort') || 'id,desc'}
                                        style={{ width: 200 }}
                                        onChange={handleSortChange}
                                    >
                                        <Option value="id,desc">Newest First</Option>
                                        <Option value="price,asc">Price: Low to High</Option>
                                        <Option value="price,desc">Price: High to Low</Option>
                                        <Option value="name,asc">Name: A to Z</Option>
                                        <Option value="name,desc">Name: Z to A</Option>
                                    </Select>
                                </div>

                                {/* Price Range Slider */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Price Range (VND)</label>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={priceRange[1]}
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const newMin = Number(e.target.value);
                                                setPriceRange([Math.min(newMin, priceRange[1]), priceRange[1]]);
                                            }}
                                            style={{ width: 180 }}
                                            addonBefore="Min"
                                        />
                                        <Slider
                                            range
                                            min={0}
                                            max={10000000}
                                            step={10000}
                                            value={priceRange}
                                            onChange={setPriceRange}
                                            style={{ flex: 1, minWidth: 200 }}
                                        />
                                        <Input
                                            type="number"
                                            min={priceRange[0]}
                                            max={10000000}
                                            value={priceRange[1]}
                                            onChange={(e) => {
                                                const newMax = Number(e.target.value);
                                                setPriceRange([priceRange[0], Math.max(newMax, priceRange[0])]);
                                            }}
                                            style={{ width: 180 }}
                                            addonBefore="Max"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={applyPriceFilter} type="primary">Apply</Button>
                                        <Button onClick={handleResetFilters}>Reset</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Divider />
                        <ProductCategories onCategorySelect={filterByCategory}/>
                    </div>
                </div>



                <div className="w-full md:w-4/5">
                    <h1 className="text-3xl font-bold mb-6">Products</h1>


                    <p className="text-gray-500 mb-6">
                        Showing {productData.length > 0 ? (pagination.current - 1) * pagination.pageSize + 1 : 0}-
                        {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} items
                        {searchParams.get('productName') &&
                            <span> matching "<strong>{searchParams.get('productName')}</strong>"</span>
                        }
                    </p>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <Row gutter={[16, 16]}>
                            {[...Array(pagination.pageSize)].map((_, index) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${index}`}>
                                    <Card>
                                        <Skeleton active paragraph={{ rows: 2 }} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : productData.length > 0 ? (
                        <>
                            <Row gutter={[16, 16]}>
                                {productData.map((product) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
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
                                            bodyStyle={{ padding: '12px' }}
                                            onClick={() => handleViewDetails(product.id)}
                                        >
                                            <div className="text-sm font-medium mb-1 line-clamp-2 h-10">{product.name}</div>
                                            <div className="text-lg font-semibold text-red-600">
                                                {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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
                                    </Col>
                                ))}
                            </Row>

                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <Pagination
                                        current={pagination.current}
                                        total={pagination.total}
                                        pageSize={pagination.pageSize}
                                        onChange={(page) => {
                                            const newParams = new URLSearchParams(searchParams);
                                            newParams.set('page', page - 1);
                                            setSearchParams(newParams);
                                            changePage(page);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        showSizeChanger={false}
                                        showQuickJumper
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <Empty
                            description={
                                <span>
                                    No products found
                                    {searchParams.get('productName') &&
                                        <span> matching "<strong>{searchParams.get('productName')}</strong>"</span>
                                    }
                                </span>
                            }
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Product;
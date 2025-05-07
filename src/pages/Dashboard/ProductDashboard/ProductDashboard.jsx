import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Input, Button, Table, Tag, Modal, message, Skeleton, Empty, Pagination } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import useProduct from '../../../hooks/useProduct.js';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import ProductDetails from './ProductDetails';
import productService from '../../../api/productService.js';
import { toast } from 'react-toastify';

const { Search } = Input;

const ProductDashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '0') + 1);
    const location = useLocation()
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/dftip4xgy/image/upload/';

    const {
        productData,
        pagination,
        loading,
        error,
        changePage,
        searchByName,
        refetch,
    } = useProduct({
        productName: searchParams.get('productName') || undefined,
        page: parseInt(searchParams.get('page') || '0'),
        size: parseInt(searchParams.get('size') || '12'),
        sort: searchParams.get('sort') || undefined
    });


    useEffect(() => {
        console.log('Effect: Triggering searchByName with productName:', searchParams.get('productName') || undefined);
        searchByName(searchParams.get('productName') || undefined);
    }, [searchParams, searchByName]);

    useEffect(() => {
        if (location.state?.showProductDetails && location.state?.productId) {
            setSelectedProductId(location.state.productId);
            setIsDetailsVisible(true);

            window.history.replaceState({}, document.title);
        }
    }, [location]);


    useEffect(() => {
        const urlPage = parseInt(searchParams.get('page') || '0') + 1;
        console.log('Effect: Syncing currentPage to URL page:', urlPage);
        if (urlPage !== currentPage) {
            setCurrentPage(urlPage);
            changePage(urlPage);
        }
    }, [searchParams, currentPage, changePage]);

    const handleSearch = useCallback((value) => {
        console.log('Handling search with value:', value);
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('productName', value);
            newParams.set('page', '0');
        } else {
            newParams.delete('productName');
            newParams.set('page', '0');
        }
        setSearchParams(newParams);
        setCurrentPage(1); // Reset to page 1
    }, [searchParams, setSearchParams]);

    const handlePageChange = useCallback((page) => {
        console.log('Handling page change to:', page);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', (page - 1).toString());
        setSearchParams(newParams);
        setCurrentPage(page);
        changePage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [searchParams, setSearchParams, changePage]);


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            width: 80,
        },
        {
            title: 'Image',
            dataIndex: 'thumbnailImgKey',
            key: 'image',
            render: (key) => (
                <img
                    src={key && key !== 'null.jpg' ? `${cloudinaryBaseUrl}/${key}` : 'https://placehold.co/50x50'}
                    alt="Product"
                    className="w-12 h-12 object-cover rounded"
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: ['category', 'name'],
            key: 'category',
        },
        {
            title: 'Price (VND)',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div className="flex gap-2">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedProductId(record.id);
                            setIsDetailsVisible(true);
                        }}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/dashboard/products/update/${record.id}`)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => {
                            setProductToDelete(record);
                            setIsDeleteModalVisible(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    const handleDelete = async () => {
        try {
            await productService.deleteProduct(productToDelete.id);
            message.success('Product deleted successfully');
            toast.success('Product deleted successfully');
            refetch();
        } catch (error) {
            message.error(error.message || 'Failed to delete product');
        } finally {
            setIsDeleteModalVisible(false);
            setProductToDelete(null);
        }
    };

    const isSearching = !!searchParams.get('productName');

    return (
        <>
            <div className="max-w-8xl mx-auto px-12 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Product Management</h1>
                    <div className="flex gap-4">
                        <Search
                            placeholder="Search products..."
                            onSearch={handleSearch}
                            defaultValue={searchParams.get('productName') || ''}
                            enterButton={<Button icon={<SearchOutlined />}/>}
                            className="w-64 mr-4"
                            allowClear
                        />
                        <Button
                            type="primary"
                            onClick={() => navigate('/dashboard/products/create')}
                        >
                            Add Product
                        </Button>
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-6">Products</h1>

                <p className="text-gray-500 mb-6">
                    Showing {productData.length > 0 ? (pagination.current - 1) * pagination.pageSize + 1 : 0}-
                    {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} items
                    {searchParams.get('productName') && (
                        <span> matching "<strong>{searchParams.get('productName')}</strong>"</span>
                    )}
                </p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <Row gutter={[16, 16]}>
                        {[...Array(pagination.pageSize)].map((_, index) => (
                            <Col xs={24} key={`skeleton-${index}`}>
                                <Card>
                                    <Skeleton active paragraph={{ rows: 1 }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : productData.length > 0 ? (
                    <>
                        <Table
                            columns={columns}
                            dataSource={productData}
                            rowKey="id"
                            pagination={false}
                            // onChange={handleTableChange}
                        />

                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <Pagination
                                    current={currentPage}
                                    total={pagination.total}
                                    pageSize={pagination.pageSize}
                                    onChange={handlePageChange}
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
                                {searchParams.get('productName') && (
                                    <span> matching "<strong>{searchParams.get('productName')}</strong>"</span>
                                )}
                            </span>
                        }
                    />
                )}
            </div>

            <ConfirmDeleteDialog
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onConfirm={handleDelete}
                name={productToDelete?.name}
                entity={'product'}
                action={'delete'}
            />
            <ProductDetails
                visible={isDetailsVisible}
                onClose={() => setIsDetailsVisible(false)}
                id={selectedProductId}
            />
        </>
    );
};

export default ProductDashboard;
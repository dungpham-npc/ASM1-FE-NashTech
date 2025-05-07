import React, { useState } from 'react';
import { Row, Col, Card, Button, Skeleton, Empty } from 'antd';
import {EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useCategory from "../../../hooks/useCategory.js";
import ConfirmDeleteDialog from "../ProductDashboard/ConfirmDeleteDialog.jsx";
import categoryService from "../../../api/categoryService.js";
import { toast } from 'react-toastify';
import { message } from 'antd';
import CategoryDetails from "./CategoryDetails.jsx";

const CategoryDashboard = () => {
    const navigate = useNavigate();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const {
        categoryData,
        loading,
        error,
        refetch,
    } = useCategory();

    const handleDelete = async () => {
        try {
            await categoryService.deleteCategory(categoryToDelete.id);
            message.success('Category deleted successfully');
            toast.success('Category deleted successfully');
            refetch();
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error(error || 'Failed to delete category');
        } finally {
            setIsDeleteModalVisible(false);
            setCategoryToDelete(null);
        }
    };

    return (
        <>
            <div className="max-w-8xl mx-auto px-12 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Category Management</h1>
                    <Button
                        type="primary"
                        onClick={() => navigate('/dashboard/categories/create')}
                    >
                        Add Category
                    </Button>
                </div>

                <h1 className="text-3xl font-bold mb-6">Categories</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <Row gutter={[16, 16]}>
                        {[...Array(4)].map((_, index) => (
                            <Col xs={24} sm={12} md={6} key={`skeleton-${index}`}>
                                <Card>
                                    <Skeleton active paragraph={{ rows: 1 }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : categoryData.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {categoryData.map((category) => (
                            <Col xs={24} sm={12} md={6} key={category.id}>
                                <Card
                                    title={category.name}
                                    actions={[
                                        <Button
                                            key="view"
                                            icon={<EyeOutlined />}
                                            onClick={() => {
                                                setSelectedCategoryId(category.id);
                                                setIsDetailsVisible(true);
                                            }}
                                        />,
                                        <Button
                                            key="edit"
                                            icon={<EditOutlined />}
                                            onClick={() => navigate(`/dashboard/categories/update/${category.id}`)}
                                        />,
                                        <Button
                                            key="delete"
                                            icon={<DeleteOutlined />}
                                            danger
                                            onClick={() => {
                                                setCategoryToDelete(category);
                                                setIsDeleteModalVisible(true);
                                            }}
                                        />,
                                    ]}
                                />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty description={<span>No categories found</span>} />
                )}
            </div>

            <ConfirmDeleteDialog
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onConfirm={handleDelete}
                name={categoryToDelete?.name}
                entity={'category'}
            />
            <CategoryDetails
                visible={isDetailsVisible}
                onClose={() => setIsDetailsVisible(false)}
                categoryId={selectedCategoryId}
            />
        </>
    );
};

export default CategoryDashboard;
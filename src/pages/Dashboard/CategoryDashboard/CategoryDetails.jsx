import React, {useState, useEffect} from 'react';
import {Modal, Spin, Row, Col, Typography, Tag} from 'antd';
import {useParams} from 'react-router-dom';
import categoryService from "../../../api/categoryService.js";
import {message} from 'antd';

const {Title, Text} = Typography;

const CategoryDetails = ({visible, onClose, categoryId}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        if (visible && categoryId) {
            const fetchCategoryDetails = async () => {
                setLoading(true);
                try {
                    const response = await categoryService.getCategoryById(categoryId);
                    setCategory(response.data);
                } catch (err) {
                    setError(err || 'Failed to fetch category details');
                    message.error(err || 'Failed to fetch category details');
                } finally {
                    setLoading(false);
                }
            };
            fetchCategoryDetails();
        }
    }, [visible, categoryId]);

    const handleClose = () => {
        setCategory(null);
        setError(null);
        onClose();
    };

    return (
        <Modal
            title="Category Details"
            visible={visible}
            onCancel={handleClose}
            footer={null}
            width={600}
        >
            {loading ? (
                <div className="flex justify-center">
                    <Spin size="large"/>
                </div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : category ? (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Title level={4}>Category Information</Title>
                    </Col>
                    <Col span={12}>
                        <Text strong>ID:</Text> <Text>{category.id}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Name:</Text> <Text>{category.name}</Text>
                    </Col>
                    <Col span={24}>
                        <Text strong>Description:</Text> <Text>{category.description}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Active:</Text>{' '}
                        <Tag color={category.isActive ? 'green' : 'red'}>
                            {category.isActive ? 'Yes' : 'No'}
                        </Tag>
                    </Col>
                    <Col span={12}>
                        <Text strong>Created At:</Text>{' '}
                        <Text>{new Date(category.createdAt).toLocaleString()}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Updated At:</Text>{' '}
                        <Text>{new Date(category.updatedAt).toLocaleString()}</Text>
                    </Col>
                </Row>
            ) : null}
        </Modal>
    );
};

export default CategoryDetails;
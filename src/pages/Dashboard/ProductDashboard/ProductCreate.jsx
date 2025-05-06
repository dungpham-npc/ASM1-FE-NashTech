import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Typography,
    InputNumber,
    Switch,
    Upload,
    message,
    Modal,
    Divider,
    Space,
    Alert,
    Row,
    Col,
    Select
} from 'antd';
import {
    UploadOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    InboxOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import productService from "../../../api/productService.js";
import {toast} from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;

const ProductCreate = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productService.getAllCategories();
                if (response.code === '200') {
                    setCategories(response.data);
                } else {
                    throw new Error('Failed to fetch categories');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch categories');
                message.error(err.message || 'Failed to fetch categories');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsConfirmVisible(true);
    };

    const handleConfirm = async () => {
        setIsConfirmVisible(false);
        setSubmitting(true);
        setError(null);

        try {
            // Prepare product data for submission
            const productData = {
                name: form.getFieldValue('name'),
                description: form.getFieldValue('description'),
                featured: form.getFieldValue('isFeatured'),
                price: form.getFieldValue('price'),
                categoryId: form.getFieldValue('categoryId'),
            };

            // Create FormData object to send both JSON and files
            const formData = new FormData();
            const jsonBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
            formData.append('request', jsonBlob);

            // Append product images
            if (fileList.length > 0) {
                fileList.forEach((file) => {
                    const fileObj = file.originFileObj || file;
                    formData.append('productImages', fileObj);
                });
            }

            // Call API to create product
            const response = await productService.createProduct(formData);
            console.log(response)

            if (response) {
                message.success('Product created successfully');
                toast.success('Product created successfully');
                navigate(`/dashboard/products/update/${response.data.id}`);
            } else {
                throw new Error('Failed to create product');
            }
        } catch (err) {
            console.error('Error creating product:', err);
            setError(err.message || `Failed to create product: ${err}`);
            message.error(err.message || 'Failed to create product');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle image upload
    const handleImageChange = ({ fileList }) => {
        setFileList(fileList);
    };

    // Image upload props
    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
                return Upload.LIST_IGNORE;
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('Image must be smaller than 5MB!');
                return Upload.LIST_IGNORE;
            }
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    // Go back to product list
    const goBack = () => {
        navigate('/dashboard/products');
    };

    return (
        <div className="product-create-container">
            <Card>
                <div className="flex items-center mb-6">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={goBack}
                        className="mr-4"
                    >
                        Back
                    </Button>
                    <Title level={2} className="mb-0">Create New Product</Title>
                </div>

                {error && (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        className="mb-6"
                    />
                )}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        isFeatured: false,
                        price: 0,
                        categoryId: 1, // Default to first category if available
                    }}
                >
                    <Row gutter={24}>
                        <Col xs={24} md={16}>
                            <Form.Item
                                name="name"
                                label="Product Name"
                                rules={[
                                    { required: true, message: 'Please enter the product name' },
                                    { max: 100, message: 'Product name cannot exceed 100 characters' },
                                ]}
                            >
                                <Input placeholder="Enter product name" maxLength={100} />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                            >
                                <TextArea
                                    placeholder="Enter description"
                                    rows={4}
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="isFeatured"
                                label="Featured"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="price"
                                label="Price (VND)"
                                rules={[
                                    { required: true, message: 'Please enter the price' },
                                    { type: 'number', min: 0.01, message: 'Price must be greater than 0' },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Enter price"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    min={0.01}
                                    step={0.01}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="categoryId"
                                label="Category"
                                rules={[{ required: true, message: 'Please select a category' }]}
                            >
                                <Select
                                    placeholder="Select a category"
                                    loading={loadingCategories}
                                    disabled={loadingCategories}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {categories.map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Product Images</Divider>

                    <Form.Item
                        name="images"
                        label="Upload Product Images"
                        extra="Upload images for this product. You can add more images after creation.
                        First image will be used as thumbnail."
                    >
                        <Dragger {...uploadProps} multiple listType="picture-card">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag files to this area to upload</p>
                            <p className="ant-upload-hint">
                                Supports JPG, PNG, WEBP. Max size: 5MB per image.
                            </p>
                        </Dragger>
                    </Form.Item>

                    <Divider />

                    <Form.Item>
                        <Space size="middle">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                                icon={<SaveOutlined />}
                                className="bg-black hover:bg-gray-800"
                            >
                                Create Product
                            </Button>

                            <Button
                                onClick={goBack}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <Modal
                title="Confirm Create"
                visible={isConfirmVisible}
                onOk={handleConfirm}
                onCancel={() => setIsConfirmVisible(false)}
            >
                <p>Are you sure you want to create the product "{form.getFieldValue('name')}"?</p>
            </Modal>
        </div>
    );
};

export default ProductCreate;
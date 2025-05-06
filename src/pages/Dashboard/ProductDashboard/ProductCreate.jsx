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
    Select,
    Tabs
} from 'antd';
import {
    UploadOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    InboxOutlined,
    EyeOutlined,
    EditOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import productService from "../../../api/productService.js";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;
const { TabPane } = Tabs;

// Rich text editor modules configuration
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link'],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link'
];

const ProductCreate = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // State for preview functionality
    const [activeTab, setActiveTab] = useState('edit');
    const [previewData, setPreviewData] = useState({
        name: '',
        description: '',
        price: 0,
        isFeatured: false,
        categoryId: 1,
        category: { name: '' },
        imageUrls: []
    });

    // Update preview data whenever form values change
    const updatePreview = () => {
        const currentValues = form.getFieldsValue();

        // Find category name based on categoryId
        const selectedCategory = categories.find(cat => cat.id === currentValues.categoryId);

        setPreviewData({
            ...currentValues,
            category: { name: selectedCategory?.name || 'Uncategorized' },
            // Create temporary URLs for uploaded images
            imageKeys: fileList.map((file, index) =>
                file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : null)
            )
        });
    };

    // Update preview whenever form values change
    const handleFormChange = () => {
        updatePreview();
    };

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productService.getAllCategories();
                if (response.code === '200') {
                    setCategories(response.data);

                    // If we have categories, update the preview with the first category
                    if (response.data.length > 0) {
                        setPreviewData(prev => ({
                            ...prev,
                            category: { name: response.data[0].name }
                        }));
                    }
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
                navigate('/dashboard/products', {
                    state: {
                        showProductDetails: true,
                        productId: response.data.id
                    }
                });
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
        // Update the fileList state
        setFileList(fileList);

        // Update the preview with the new images
        updatePreview();
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

            // Create a temporary URL for preview
            file.url = URL.createObjectURL(file);

            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    // Go back to product list
    const goBack = () => {
        navigate('/dashboard/products');
    };

    // Handle the tab change
    const handleTabChange = (key) => {
        setActiveTab(key);
        // If switching to preview tab, update the preview data
        if (key === 'preview') {
            updatePreview();
        }
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

                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    type="card"
                    className="mb-6"
                >
                    <TabPane
                        tab={
                            <span>
                                <EditOutlined />
                                Edit
                            </span>
                        }
                        key="edit"
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            onValuesChange={handleFormChange}
                            initialValues={{
                                isFeatured: false,
                                price: 0,
                                categoryId: 1,
                                description: '',
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
                                        <ReactQuill
                                            theme="snow"
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Enter rich text description"
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
                                            { type: 'number', min: 10000, message: 'Price must be greater than 0' },
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

                                    <Button
                                        type="dashed"
                                        icon={<EyeOutlined />}
                                        onClick={() => setActiveTab('preview')}
                                    >
                                        Preview
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <EyeOutlined />
                                Preview
                            </span>
                        }
                        key="preview"
                    >
                        <ProductPreview product={previewData} />
                        <Divider />
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setActiveTab('edit')}
                        >
                            Back to Edit
                        </Button>
                    </TabPane>
                </Tabs>
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

// Product Preview Component that mimics the ProductDetails view
const ProductPreview = ({ product }) => {
    // Create default placeholder if no images
    const hasImages = product.imageKeys && product.imageKeys.length > 0;
    const [selectedImage, setSelectedImage] = useState(0);

    const handleImageSelect = (index) => {
        setSelectedImage(index);
    };

    return (
        <div className="preview-container bg-white p-6 rounded-lg border border-gray-200">
            <Title level={3} className="mb-4">Product Preview</Title>
            <Alert
                message="This is how your product will look to customers"
                type="info"
                showIcon
                className="mb-6"
            />

            <Row gutter={[48, 24]}>
                <Col xs={24} md={12}>
                    <div className="bg-gray-50 p-8 rounded-lg">
                        <div className="w-full h-80 flex items-center justify-center">
                            {hasImages ? (
                                <img
                                    src={product.imageKeys[selectedImage]}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <p>No product image</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image gallery */}
                    {hasImages && (
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                            {product.imageKeys.map((imageUrl, index) => (
                                <div
                                    key={index}
                                    className={`w-24 h-24 flex-shrink-0 bg-gray-50 rounded cursor-pointer hover:opacity-75 transition-opacity ${
                                        selectedImage === index ? "border-2 border-blue-500" : ""
                                    }`}
                                    onClick={() => handleImageSelect(index)}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Product view ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </Col>

                <Col xs={24} md={12}>
                    <Title level={2}>{product.name || 'Product Name'}</Title>

                    {/* Category, ID, and rating */}
                    <div className="mb-4">
                        <Text type="secondary">Product ID: (Will be generated)</Text>
                        <div className="mt-2">
                            {product.category?.name && (
                                <div className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm mr-2">
                                    {product.category.name}
                                </div>
                            )}
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
                        <div className="product-description quill-content">
                            {product.description ? (
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            ) : (
                                <Text type="secondary">No description available for this product.</Text>
                            )}
                        </div>
                    </div>

                    <Divider />

                    {/* Sample Actions */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-3">
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                size="large"
                                className="bg-black hover:bg-gray-800 flex-1"
                                disabled
                            >
                                Add to Cart
                            </Button>
                        </div>
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
                                    <div>{product.name || 'Product Name'}</div>
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
                                    <Text strong>Featured:</Text>
                                    <div>{product.isFeatured ? 'Yes' : 'No'}</div>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default ProductCreate;
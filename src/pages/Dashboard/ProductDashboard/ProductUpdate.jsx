import React, {useState, useEffect} from 'react';
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
    Spin,
    Divider,
    Space,
    Alert,
    Row,
    Col,
    Tabs,
    Modal,
    Empty,
    Image,
    Select
} from 'antd';
import {
    PlusOutlined,
    UploadOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    InboxOutlined,
    EditOutlined,
    EyeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import productService from "../../../api/productService.js";
import {toast} from "react-toastify";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const {Title, Text} = Typography;
const {TextArea} = Input;
const {TabPane} = Tabs;
const {Option} = Select;

const quillModules = {
    toolbar: [[{'header': [1, 2, 3, false]}], ['bold', 'italic', 'underline', 'strike'], [{'list': 'ordered'}, {'list': 'bullet'}], [{'color': []}, {'background': []}], ['link'], ['clean']],
};

const quillFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'color', 'background', 'link'];

const ProductUpdate = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [imagesModalVisible, setImagesModalVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/dftip4xgy/image/upload/';
    const [previewData, setPreviewData] = useState({
        name: '', description: '', price: 0, isFeatured: false, categoryId: 1, category: {name: ''}, imageKeys: []
    });

    const updatePreview = () => {
        const currentValues = form.getFieldsValue();
        const selectedCategory = categories.find(cat => cat.id === currentValues.categoryId);

        // Use the actual product ID from params
        setPreviewData({
            ...currentValues,
            id: id, // Pass the product ID from params
            category: { name: selectedCategory?.name || 'Uncategorized' },
            imageKeys: fileList
                .map(file => file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : null))
                .filter(Boolean)
        });
    };

    const handleFormChange = () => {
        updatePreview();
    };

    useEffect(() => {
        if (product && categories.length > 0) {
            const selectedCategory = categories.find(cat => cat.id === product.category.id);

            setPreviewData({
                ...product,
                categoryId: product.category.id,
                category: { name: selectedCategory?.name || 'Uncategorized' },
                imageKeys: product.imageKeys.map(key => `${cloudinaryBaseUrl}/${key}`)
            });
        }
    }, [product, categories, cloudinaryBaseUrl]);

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

    // Fetch product on component mount
    useEffect(() => {
        const fetchProduct = async () => {
            setInitialLoading(true);
            try {
                const response = await productService.getProductById(id);
                const data = response.data;
                setProduct(data);
                form.setFieldsValue({
                    name: data.name,
                    description: data.description,
                    isFeatured: data.isFeatured,
                    price: data.price,
                    categoryId: data.category.id,
                });
                setFileList(data.imageKeys.map((key, index) => ({
                    uid: index, name: `image-${index}`, status: 'done', url: `${cloudinaryBaseUrl}/${key}`,
                })));
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product. Please try again.');
            } finally {
                setInitialLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        } else {
            setError("No product ID provided");
            setInitialLoading(false);
        }
    }, [id, form]);

    const handleTabChange = (key) => {
        if (key === 'preview' && activeTab !== 'preview') {
            updatePreview();
        }
        setActiveTab(key);
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsConfirmVisible(true);
    };

    const handleConfirm = async () => {
        setIsConfirmVisible(false);
        setSubmitting(true);
        setError(null);

        try {
            const productData = {
                name: form.getFieldValue('name'),
                description: form.getFieldValue('description'),
                featured: form.getFieldValue('isFeatured'),
                price: form.getFieldValue('price'),
                categoryId: form.getFieldValue('categoryId'),
            };

            for (const key in productData) {
                console.log(`${key}: ${productData[key]}`);
            }

            const formData = new FormData();
            formData.append('request', new Blob([JSON.stringify(productData)], {type: 'application/json'}));
            const imageFiles = fileList
                .map((file) => file.originFileObj)
                .filter((file) => file instanceof File);
            imageFiles.forEach((file) => {
                formData.append('productImages', file);
            });

            const response = await productService.updateProduct(id, formData);

            if (response) {
                message.success('Product updated successfully');
                toast.success("Product updated successfully");
                navigate('/dashboard/products', {
                    state: {
                        showProductDetails: true, productId: id
                    }
                });
            } else {
                throw new Error('Failed to update product');
            }
        } catch (err) {
            console.error('Error updating product:', err);
            setError(err.message || 'Failed to update product');
            message.error(err.message || 'Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle image change
    const handleImageChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-5);
        setFileList(newFileList);
    };

    // Handle image upload properties
    const beforeImageUpload = (file) => {
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
        return false;
    };

    // Go back to product list
    const goBack = () => {
        navigate('/dashboard/products');
    };

    // Open images modal
    const openImagesModal = () => {
        setImagesModalVisible(true);
    };

    // Show loading state
    if (initialLoading) {
        return (<div className="flex items-center justify-center h-64">
            <Spin size="large" tip="Loading product data..."/>
        </div>);
    }

    // Show error state
    if (error && !product) {
        return (<div className="p-6">
            <Alert
                message="Error Loading Product"
                description={<div>
                    <p>{error}</p>
                    <Button
                        type="primary"
                        onClick={goBack}
                        className="mt-4"
                    >
                        Back to List
                    </Button>
                </div>}
                type="error"
                showIcon
            />
        </div>);
    }

    return (<div className="product-update-container">
        <Card>
            <div className="flex items-center mb-6">
                <Button
                    icon={<ArrowLeftOutlined/>}
                    onClick={goBack}
                    className="mr-4"
                >
                    Back
                </Button>
                <Title level={2} className="mb-0">Edit Product</Title>
            </div>

            {error && (<Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                className="mb-6"
            />)}

            <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                <TabPane tab={
                    <span>
                                <EditOutlined/>
                                Edit
                            </span>
                }
                         key="1"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        onValuesChange={handleFormChange}
                    >
                        <Row gutter={24}>
                            <Col xs={24} md={16}>
                                <Form.Item
                                    name="name"
                                    label="Product Name"
                                    rules={[{required: true, message: 'Please enter the product name'}, {
                                        max: 100, message: 'Product name cannot exceed 100 characters'
                                    },]}
                                >
                                    <Input placeholder="Enter product name" maxLength={100}/>
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
                                    rules={[{required: true, message: 'Please enter the price'}, {
                                        type: 'number', min: 0.01, message: 'Price must be greater than 0'
                                    },]}
                                >
                                    <InputNumber
                                        style={{width: '100%'}}
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
                                    rules={[{required: true, message: 'Please select a category'}]}
                                >
                                    <Select
                                        placeholder="Select a category"
                                        loading={loadingCategories}
                                        disabled={loadingCategories}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {categories.map((category) => (
                                            <Option key={category.id} value={category.id}>
                                                {category.name}
                                            </Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">Product Images</Divider>

                        {product && product.imageKeys && product.imageKeys.length > 0 ? (<div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <Text strong className="block">Current Images:</Text>
                                <Button
                                    type="link"
                                    onClick={openImagesModal}
                                >
                                    View All Images
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.imageKeys.slice(0, 5).map((key, index) => (
                                    <div key={index} className="relative">
                                        <Image
                                            src={`${cloudinaryBaseUrl}/${key}`}
                                            alt={`Product Image ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="rounded object-cover"
                                        />
                                    </div>))}
                                {product.imageKeys.length > 5 && (<div
                                    className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded">
                                    <Text type="secondary">+{product.imageKeys.length - 5} more</Text>
                                </div>)}
                            </div>
                        </div>) : (<div className="mb-6">
                            <Empty description="No product images available"/>
                        </div>)}

                        <Form.Item
                            name="images"
                            label="Upload New Product Images"
                            extra="Upload new images for this product."
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleImageChange}
                                beforeUpload={beforeImageUpload}
                                multiple
                            >
                                {fileList.length >= 5 ? null : (<div>
                                    <PlusOutlined/>
                                    <div style={{marginTop: 8}}>Upload</div>
                                </div>)}
                            </Upload>
                        </Form.Item>

                        <Divider/>

                        <Form.Item>
                            <Space size="middle">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitting}
                                    icon={<SaveOutlined/>}
                                    className="bg-black hover:bg-gray-800"
                                >
                                    Save Changes
                                </Button>

                                <Button
                                    onClick={goBack}
                                >
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                <EyeOutlined/>
                Preview
            </span>
                    }
                    key="preview"
                >
                    <ProductPreview product={previewData}/>
                    <Divider/>
                    <Button
                        type="primary"
                        icon={<EditOutlined/>}
                        onClick={() => setActiveTab('1')}
                    >
                        Back to Edit
                    </Button>
                </TabPane>

                <TabPane tab="Additional Information" key="2">
                    <div className="mb-4">
                        <Title level={4} className="mb-0">Product Details</Title>
                    </div>
                    <div>
                        <Text strong>Created At: </Text>
                        <Text>{new Date(product.createdAt).toLocaleString()}</Text>
                    </div>
                    <div className="mt-2">
                        <Text strong>Updated At: </Text>
                        <Text>{new Date(product.updatedAt).toLocaleString()}</Text>
                    </div>
                    <div className="mt-2">
                        <Text strong>Average Rating: </Text>
                        <Text>{product.averageRating || 'N/A'} / 5</Text>
                    </div>
                </TabPane>
            </Tabs>
        </Card>

        <Modal
            title="Confirm Update"
            visible={isConfirmVisible}
            onOk={handleConfirm}
            onCancel={() => setIsConfirmVisible(false)}
        >
            <p>Are you sure you want to update the product "{form.getFieldValue('name')}"?</p>
        </Modal>

        <Modal
            title="Product Images"
            visible={imagesModalVisible}
            onCancel={() => setImagesModalVisible(false)}
            footer={[<Button key="cancel" onClick={() => setImagesModalVisible(false)}>
                Close
            </Button>,]}
            width={800}
        >
            {product && product.imageKeys && (<div className="product-images-gallery">
                <Row gutter={[16, 16]}>
                    {product.imageKeys.map((key, index) => (<Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <div className="p-2 border border-gray-200 rounded">
                            <Image
                                src={`${cloudinaryBaseUrl}/${key}`}
                                alt={`Product Image ${index + 1}`}
                                className="w-full h-32 object-contain"
                            />
                            <div className="text-center mt-2">
                                <Text type="secondary">Image #{index + 1}</Text>
                            </div>
                        </div>
                    </Col>))}
                </Row>
            </div>)}
        </Modal>
    </div>);
};

const ProductPreview = ({product}) => {
    const hasImages = product.imageKeys && product.imageKeys.length > 0;
    const [selectedImage, setSelectedImage] = useState(0);

    const handleImageSelect = (index) => {
        setSelectedImage(index);
    };

    return (
        <div className="preview-container bg-white p-6 rounded-lg border border-gray-200">
            <Title level={3} className="mb-4">Product Preview</Title>
            <div className="mb-6">
                <Alert
                    message="This is how your product will look to customers"
                    type="info"
                    showIcon
                    className="mb-6 pb-6"
                />
            </div>

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

                    {/* Category and other info */}
                    <div className="mb-4">
                        <Text type="secondary">Product ID: Preview</Text>
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
                            {Number(product.price || 0).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}
                        </Title>
                    </div>

                    <Divider/>

                    {/* Description */}
                    <div className="mb-6">
                        <Title level={4}>Description</Title>
                        <div className="product-description quill-content">
                            {product.description ? (
                                <div dangerouslySetInnerHTML={{__html: product.description}}/>
                            ) : (
                                <Text type="secondary">No description available for this product.</Text>
                            )}
                        </div>
                    </div>

                    <Divider/>

                    {/* Sample Actions */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-3">
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined/>}
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
        </div>
    );
};

export default ProductUpdate;
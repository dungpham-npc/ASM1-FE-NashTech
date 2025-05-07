// src/pages/Dashboard/CategoryUpdate.jsx
import React, {useState, useEffect} from 'react';
import {Form, Input, Button, message, Spin} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import categoryService from "../../../api/categoryService.js";
import {toast} from 'react-toastify';

const CategoryUpdate = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await categoryService.getCategoryById(id);
                if (response.code === '200') {
                    form.setFieldsValue({
                        name: response.data.name,
                        description: response.data.description,
                    });
                } else {
                    throw new Error('Failed to fetch category');
                }
            } catch (err) {
                setError(err || 'Failed to fetch category');
            } finally {
                setFetching(false);
            }
        };
        fetchCategory();
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await categoryService.updateCategory(id, values);
            message.success('Category updated successfully');
            toast.success('Category updated successfully');
            navigate('/dashboard/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            alert(error)
            message.error(error || error.message || 'Failed to update category');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="max-w-8xl mx-auto px-12 py-8 flex justify-center">
                <Spin size="large"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-8xl mx-auto px-12 py-8">
                <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto px-12 py-8">
            <h1 className="text-3xl font-bold mb-6">Update Category</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {required: true, message: 'Name is required'},
                        {whitespace: true, message: 'Name cannot be blank'},
                        {max: 50, message: 'Name cannot exceed 50 characters'},
                    ]}
                >
                    <Input placeholder="Enter category name"/>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {required: true, message: 'Description is required'},
                        {whitespace: true, message: 'Description cannot be blank'},
                    ]}
                >
                    <Input.TextArea rows={4} placeholder="Enter category description"/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update
                    </Button>
                    <Button
                        className="ml-4"
                        onClick={() => navigate('/dashboard/categories')}
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CategoryUpdate;
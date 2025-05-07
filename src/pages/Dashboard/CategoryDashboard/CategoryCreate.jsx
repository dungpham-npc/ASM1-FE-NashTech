// src/pages/Dashboard/CategoryCreate.jsx
import React, {useState} from 'react';
import {Form, Input, Button, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import categoryService from "../../../api/categoryService.js";
import {toast} from 'react-toastify';

const CategoryCreate = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await categoryService.createCategory(values);
            message.success('Category created successfully');
            toast.success('Category created successfully');
            navigate('/dashboard/categories');
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error(error);
            message.error(error || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-8xl mx-auto px-12 py-8">
            <h1 className="text-3xl font-bold mb-6">Create Category</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{name: '', description: ''}}
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
                        Create
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

export default CategoryCreate;
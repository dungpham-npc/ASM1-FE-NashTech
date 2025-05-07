// src/pages/Dashboard/UserCreate.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import userService from "../../../api/userService.js";
import { toast } from 'react-toastify';

const { Option } = Select;

const UserCreate = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await userService.createUser(values);
            if (response.code === '200') {
                message.success('User created successfully');
                toast.success('User created successfully');
                navigate('/dashboard/users');
            } else {
                throw new Error('Failed to create user');
            }
        } catch (error) {
            message.error(error.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-8xl mx-auto px-12 py-8">
            <h1 className="text-3xl font-bold mb-6">Create User</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ email: '', roleId: 1 }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Email is required' },
                        { type: 'email', message: 'Invalid email format' },
                    ]}
                >
                    <Input placeholder="Enter email" />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="roleId"
                    rules={[{ required: true, message: 'Role is required' }]}
                >
                    <Select placeholder="Select role">
                        <Option value={1}>CUSTOMER</Option>
                        <Option value={2}>ADMIN</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create
                    </Button>
                    <Button
                        className="ml-4"
                        onClick={() => navigate('/dashboard/users')}
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserCreate;
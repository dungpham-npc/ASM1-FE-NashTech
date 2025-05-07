import React, { useState } from 'react';
import { Form, Input, Button, Modal, message, Space, Typography } from 'antd';
import userService from '../../api/userService';
import { toast } from 'react-toastify';
import {CheckCircleTwoTone} from "@ant-design/icons";

const { Title } = Typography;

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [otpForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');

    // Fetch email for OTP modal display
    const fetchEmail = async () => {
        try {
            const response = await userService.getCurrentUserProfile();
            if (response.code === '200') {
                setEmail(response.data.email);
            }
        } catch (err) {
            console.error('Failed to fetch email for OTP modal:', err);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await userService.changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            });
            if (response.code === '200') {
                message.success({
                    content: 'OTP sent to your email. Please verify to complete password change.',
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                });
                toast.success('OTP sent to your email. Please verify to complete password change.');
                await fetchEmail(); // Fetch email for OTP modal
                setIsOtpModalVisible(true);
            } else {
                throw new Error(response.message || 'Failed to initiate password change');
            }
        } catch (err) {
            setError(err.message || 'Failed to initiate password change');
            message.error(err.message || 'Failed to initiate password change');
        } finally {
            setLoading(false);
        }
    };

    const onFinishOtp = async (values) => {
        setLoading(true);
        try {
            const response = await userService.verifyOtp({ otp: values.otp });
            if (response.code === '200') {
                message.success({
                    content: 'Password changed successfully.',
                });
                toast.success('Password changed successfully');
                setIsOtpModalVisible(false);
                form.resetFields();
                otpForm.resetFields();
            } else {
                throw new Error(response.message || 'Failed to verify OTP');
            }
        } catch (err) {
            setError(err.message || 'Failed to verify OTP');
            message.error(err.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <Title level={4} className="mb-4">Change Password</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ oldPassword: '', newPassword: '' }}
            >
                <Form.Item
                    label="Old Password"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Old password is required' }]}
                >
                    <Input.Password
                        placeholder="Enter old password"
                        className="rounded-md"
                    />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                        { required: true, message: 'New password is required' },
                        { min: 8, message: 'Password must be at least 8 characters long' },
                    ]}
                >
                    <Input.Password
                        placeholder="Enter new password"
                        className="rounded-md"
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading} className="rounded-md">
                            Submit
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            <Modal
                title={
                    <Space>
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                        <Title level={4} style={{ margin: 0 }}>Verify OTP</Title>
                    </Space>
                }
                visible={isOtpModalVisible}
                onCancel={() => setIsOtpModalVisible(false)}
                footer={null}
                className="text-center"
            >
                <p className="mb-4">
                    An OTP has been sent to <strong>{email}</strong>. Please enter it below to complete the password change.
                </p>
                <Form
                    form={otpForm}
                    layout="vertical"
                    onFinish={onFinishOtp}
                    initialValues={{ otp: '' }}
                >
                    <Form.Item
                        label="OTP"
                        name="otp"
                        rules={[
                            { required: true, message: 'OTP is required' },
                            { len: 6, message: 'OTP must be 6 digits' },
                            { pattern: /^\d+$/, message: 'OTP must contain only digits' },
                        ]}
                    >
                        <Input placeholder="Enter 6-digit OTP" className="rounded-md text-center" maxLength={6} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading} className="rounded-md">
                                Verify
                            </Button>
                            <Button className="rounded-md" onClick={() => setIsOtpModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ChangePassword;
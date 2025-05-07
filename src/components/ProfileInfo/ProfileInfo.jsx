import React from 'react';
import { Typography, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ProfileInfo = ({ profile }) => {
    return (
        <div className="p-6">
            <Space direction="vertical" size="middle" className="w-full">
                <Space>
                    <Avatar icon={<UserOutlined />} size="large" style={{ backgroundColor: '#1890ff' }} />
                    <Text strong style={{ fontSize: '18px' }}>Profile Information</Text>
                </Space>
                <div>
                    <Text strong>Email:</Text>{' '}
                    <Text className="text-blue-600">{profile.email}</Text>
                </div>
            </Space>
        </div>
    );
};

export default ProfileInfo;
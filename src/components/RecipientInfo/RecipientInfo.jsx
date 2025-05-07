import React from 'react';
import { Typography, Button, Card, Tag, Divider, Empty, Row, Col } from 'antd';
import { HomeOutlined, PhoneOutlined, UserOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const RecipientInfo = ({ profile }) => {
    const navigate = useNavigate();
    const recipients = profile?.recipientInfo || [];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <Title level={4} className="mb-0">Your Delivery Addresses</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/dashboard/recipient-info/new')}
                >
                    Add New Address
                </Button>
            </div>

            {recipients.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {recipients.map((recipient) => (
                        <Col xs={24} key={recipient.id}>
                            <Card
                                hoverable
                                className={`border ${recipient.isDefault ? 'border-blue-500' : 'border-gray-200'} rounded-lg overflow-hidden`}
                                bodyStyle={{ padding: 0 }}
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                <HomeOutlined className="text-blue-600 text-xl" />
                                            </div>
                                            <div>
                                                <div className="flex items-center mb-1">
                                                    <Text strong className="text-lg mr-2">
                                                        {recipient.firstName} {recipient.lastName}
                                                    </Text>
                                                    {recipient.isDefault && (
                                                        <Tag color="blue">Default</Tag>
                                                    )}
                                                </div>
                                                <Text className="text-gray-500 block">
                                                    <UserOutlined className="mr-2" />
                                                    Recipient
                                                </Text>
                                            </div>
                                        </div>
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            onClick={() => navigate(`/dashboard/recipient-info/edit/${recipient.id}`)}
                                        >
                                            Edit
                                        </Button>
                                    </div>

                                    <Divider className="my-4" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start">
                                            <HomeOutlined className="mt-1 mr-3 text-gray-500" />
                                            <div>
                                                <Text strong className="block mb-1">Delivery Address</Text>
                                                <Text className="text-gray-600">{recipient.address}</Text>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <PhoneOutlined className="mt-1 mr-3 text-gray-500" />
                                            <div>
                                                <Text strong className="block mb-1">Contact Number</Text>
                                                <Text className="text-gray-600">{recipient.phone}</Text>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {recipient.isDefault ? (
                                    <div className="bg-blue-50 px-5 py-3 border-t border-blue-200">
                                        <Text className="text-blue-700">
                                            This address will be used as your default shipping address.
                                        </Text>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
                                        <Text className="text-gray-500">Not set as default</Text>
                                        <Button size="small" onClick={() => console.log('Set as default', recipient.id)}>
                                            Set as Default
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Card className="text-center py-8">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="mt-2">
                                <Text className="text-gray-500">You haven't added any delivery addresses yet.</Text>
                                <div className="mt-4">
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => navigate('/dashboard/recipient-info/new')}
                                    >
                                        Add Your First Address
                                    </Button>
                                </div>
                            </div>
                        }
                    />
                </Card>
            )}
        </div>
    );
};

export default RecipientInfo;
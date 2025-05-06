// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Button } from 'antd';
import { UserOutlined, ShoppingOutlined, TagsOutlined, RightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from "../../../api/axios.js";
import endpoints from "../../../api/endpoint.js";

const { Title, Text } = Typography;

/**
 * AdminDashboard component - Simplified dashboard for admin users
 * Displays total customers and recent customers with quick actions
 */
const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCustomers: 0,
    });
    const [recentCustomers, setRecentCustomers] = useState([]);
    const navigate = useNavigate();

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch total customers and recent customers
                const userCriteria = { page: 0, size: 5, sort: 'createdAt,desc', role: 'CUSTOMER' };
                const response = await axiosInstance.get(endpoints.user.getAll, {
                    params: userCriteria,
                });

                if (response && response.data && response.data.metadata) {
                    const { content, totalElements } = response.data.metadata;
                    setRecentCustomers(content);
                    setStats({ totalCustomers: totalElements });
                } else {
                    throw new Error('Failed to fetch customer data');
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setRecentCustomers([]);
                setStats({ totalCustomers: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Customer table columns
    const customerColumns = [
        {
            title: 'Customer',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <Text strong>{`${record.firstName} ${record.lastName}`}</Text>
                    <div>
                        <Text type="secondary">{record.email}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Joined',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Last Updated',
            dataIndex: 'lastUpdatedAt',
            key: 'lastUpdatedAt',
            render: (date) => (date ? new Date(date).toLocaleString() : 'N/A'),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <Title level={2}>Admin Dashboard</Title>
                <Text type="secondary">Welcome to the admin dashboard!</Text>
            </div>

            {/* Statistics Card: Total Customers */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} md={8}>
                    <Card hoverable className="border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl text-purple-500">
                                <UserOutlined />
                            </div>
                            <Statistic
                                title="Total Customers"
                                value={stats.totalCustomers}
                                loading={loading}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Recent Customers */}
            <Card
                title="Recent Customers"
                className="mb-6"
                extra={
                    <Link to="/dashboard/customers">
                        <Button type="link" icon={<RightOutlined />}>
                            View All Customers
                        </Button>
                    </Link>
                }
            >
                <Table
                    columns={customerColumns}
                    dataSource={recentCustomers}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
            </Card>

            {/* Quick Actions */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="Quick Actions">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8}>
                                <Button
                                    type="primary"
                                    icon={<UserOutlined />}
                                    className="w-full"
                                    onClick={() => navigate('/dashboard/customers')}
                                >
                                    Manage Customers
                                </Button>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Button
                                    type="default"
                                    icon={<ShoppingOutlined />}
                                    className="w-full"
                                    onClick={() => navigate('/dashboard/products')}
                                >
                                    Manage Products
                                </Button>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Button
                                    type="default"
                                    icon={<TagsOutlined />}
                                    className="w-full"
                                    onClick={() => navigate('/dashboard/categories')}
                                >
                                    Manage Categories
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
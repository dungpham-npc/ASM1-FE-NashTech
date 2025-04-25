// src/components/DashboardLayout.js
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Breadcrumb } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    ShoppingOutlined,
    TagsOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { message } from 'antd';

const { Header, Sider, Content } = Layout;

/**
 * DashboardLayout - Simplified layout for admin and customer dashboard
 * Uses Tailwind CSS for styling
 */
const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Configure message notifications globally
    useEffect(() => {
        message.config({
            top: 100,
            duration: 3,
            maxCount: 3,
        });
    }, []);

    // Generate breadcrumb items based on current path
    useEffect(() => {
        const pathSnippets = location.pathname.split('/').filter((i) => i);
        const breadcrumbItems = pathSnippets.map((snippet, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return {
                key: url,
                title: snippet.charAt(0).toUpperCase() + snippet.slice(1).replace('-', ' '),
                path: url,
            };
        });

        setBreadcrumbItems([
            { key: '/dashboard', title: 'Dashboard', path: '/dashboard' },
            ...breadcrumbItems.filter((item) => item.key !== '/dashboard'),
        ]);
    }, [location.pathname]);

    // Handle logout
    const handleLogout = () => {
        logout();
        message.success('Logged out successfully');
        navigate('/login');
    };

    // Menu items based on user role
    const menuItems = user?.role === 'ADMIN' ? [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
            key: '/dashboard/categories',
            icon: <TagsOutlined />,
            label: <Link to="/dashboard/categories">Category Management</Link>,
        },
        {
            key: '/dashboard/products',
            icon: <ShoppingOutlined />,
            label: <Link to="/dashboard/products">Product Management</Link>,
        },
        {
            key: '/dashboard/customers',
            icon: <UserOutlined />,
            label: <Link to="/dashboard/customers">Customer Management</Link>,
        },
    ] : [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
            key: '/dashboard/profile',
            icon: <UserOutlined />,
            label: <Link to="/dashboard/profile">My Profile</Link>,
        },
    ];

    // User dropdown menu
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'My Profile',
            onClick: () => navigate('/dashboard/profile'),
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    // Selected menu key
    const selectedKeys = [location.pathname];

    // Test notification button
    const testNotification = () => {
        message.success('Test success message', 3);
        message.error('Test error message', 3);
        message.warning('Test warning message', 3);
    };

    return (
        <Layout className="min-h-screen">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                className="bg-[#001529] min-h-screen"
            >
                <div className="h-16 flex items-center justify-center text-white text-lg font-bold">
                    {collapsed ? 'SF' : 'ShopFun'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedKeys}
                    items={menuItems}
                    className="bg-[#001529] min-h-[calc(100vh-64px)]"
                />
            </Sider>
            <Layout>
                <Header className="bg-white px-4 flex items-center justify-between shadow-sm">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-lg text-black"
                    />
                    <div className="flex items-center gap-4">
                        <Button onClick={testNotification} className="text-black">
                            Test Notification
                        </Button>
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Avatar icon={<UserOutlined />} />
                                {!collapsed && (
                                    <span className="text-black">
                    {user?.role === 'ADMIN' ? 'Admin' : 'Customer'}
                  </span>
                                )}
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content className="m-4 p-6 bg-white min-h-[calc(100vh-64px)]">
                    <div className="mb-4">
                        <Breadcrumb>
                            {breadcrumbItems.map((item) => (
                                <Breadcrumb.Item key={item.key}>
                                    <Link to={item.path}>{item.title}</Link>
                                </Breadcrumb.Item>
                            ))}
                        </Breadcrumb>
                    </div>
                    <div className="p-6 bg-gray-100 rounded-md">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
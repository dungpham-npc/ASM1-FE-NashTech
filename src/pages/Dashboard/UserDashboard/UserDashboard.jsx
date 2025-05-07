import React, { useState, useEffect, useCallback } from 'react';
import {Row, Col, Table, Button, Input, Tag, Modal, message, Skeleton, Empty, Pagination} from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useUser from "../../../hooks/useUser.js";
import { toast } from 'react-toastify';
import userService from "../../../api/userService.js";
import ConfirmDeleteDialog from "../ProductDashboard/ConfirmDeleteDialog.jsx";

const { Search } = Input;

const UserDashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isDeactivateConfirmVisible, setIsDeactivateConfirmVisible] = useState(false);
    const [isActivateConfirmVisible, setIsActivateConfirmVisible] = useState(false);
    const [userToDeactivate, setUserToDeactivate] = useState(null);
    const [userToActivate, setUserToActivate] = useState(null);
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '0') + 1); // 1-based

    const {
        userData,
        pagination,
        loading,
        error,
        changePage,
        refetch,
        searchByEmail,
    } = useUser({
        email: searchParams.get('email') || undefined,
        page: parseInt(searchParams.get('page') || '0'),
        size: parseInt(searchParams.get('size') || '10'),
        sort: searchParams.get('sort') || 'id,desc',
    });

    // Sync local page state with URL
    useEffect(() => {
        const urlPage = parseInt(searchParams.get('page') || '0') + 1;
        if (urlPage !== currentPage) {
            setCurrentPage(urlPage);
            changePage(urlPage - 1); // Convert to 0-based for API
        }
    }, [searchParams, currentPage, changePage]);

    const handlePageChange = useCallback((page) => {
        console.log('Handling page change to:', page);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', (page - 1).toString()); // Convert to 0-based for API
        setSearchParams(newParams);
        setCurrentPage(page);
        changePage(page - 1); // Convert to 0-based for API
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [searchParams, setSearchParams, changePage]);

    const handleTableChange = (pagination, filters, sorter) => {
        const newParams = new URLSearchParams(searchParams);
        if (sorter.order) {
            const sortOrder = sorter.order === 'descend' ? 'desc' : 'asc';
            const sortField = sorter.field;
            newParams.set('sort', `${sortField},${sortOrder}`);
        } else {
            newParams.delete('sort');
        }
        setSearchParams(newParams);
        refetch({ sort: newParams.get('sort') });
    };

    const handleSearch = (value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('email', value);
            newParams.set('page', '0');
        } else {
            newParams.delete('email');
            newParams.set('page', '0');
        }
        setSearchParams(newParams);
        setCurrentPage(1);
        searchByEmail(value || undefined);
    };

    const handleDeactivate = async () => {
        try {
            await userService.deactivateUser(userToDeactivate.id);
            message.success('User deactivated successfully');
            toast.success('User deactivated successfully');
            refetch();
        } catch (error) {
            message.error(error.message || 'Failed to deactivate user');
        } finally {
            setIsDeactivateConfirmVisible(false);
            setUserToDeactivate(null);
        }
    };

    const handleActivate = async () => {
        try {
            await userService.activateUser(userToActivate.id);
            message.success('User activated successfully');
            toast.success('User activated successfully');
            refetch();
        } catch (error) {
            message.error(error.message || 'Failed to activate user');
        } finally {
            setIsActivateConfirmVisible(false);
            setUserToActivate(null);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            width: 80,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'ADMIN' ? 'blue' : 'green'}>{role}</Tag>
            ),
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            render: (active) => (
                <Tag color={active ? 'green' : 'red'}>{active ? 'Yes' : 'No'}</Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div className="flex gap-2">
                    <Button
                        danger
                        onClick={() => {
                            setUserToDeactivate(record);
                            setIsDeactivateConfirmVisible(true);
                        }}
                        disabled={!record.active}
                    >
                        Deactivate
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setUserToActivate(record);
                            setIsActivateConfirmVisible(true);
                        }}
                        disabled={record.active}
                    >
                        Activate
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-8xl mx-auto px-12 py-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Management</h1>
                <div>
                    <Search
                        placeholder="Search by email..."
                        onSearch={handleSearch}
                        enterButton={<Button icon={<SearchOutlined />} />}
                        className="w-64 mr-4"
                        allowClear
                        onClear={() => handleSearch('')}
                    />
                    <Button
                        type="primary"
                        onClick={() => navigate('/dashboard/users/create')}
                    >
                        Add User
                    </Button>
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-6">Users</h1>

            <p className="text-gray-500 mb-6">
                Showing {userData.length > 0 ? pagination.current * pagination.pageSize + 1 - pagination.pageSize : 0}-
                {Math.min((pagination.current + 1) * pagination.pageSize, pagination.total)} of {pagination.total} users
                {searchParams.get('email') && (
                    <span> matching "<strong>{searchParams.get('email')}</strong>"</span>
                )}
            </p>

            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
            ) : userData.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={userData}
                    rowKey="id"
                    pagination={false}
                    onChange={handleTableChange}
                />
            ) : (
                <Empty description={<span>No users found</span>} />
            )}

            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        current={currentPage}
                        total={pagination.total}
                        pageSize={pagination.pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper
                    />
                </div>
            )}

            <ConfirmDeleteDialog
                visible={isDeactivateConfirmVisible}
                onCancel={() => setIsDeactivateConfirmVisible(false)}
                onConfirm={handleDeactivate}
                name={userToDeactivate?.email}
                entity={'user'}
                action={'deactivate'}
            />
            <Modal
                title="Confirm Activation"
                visible={isActivateConfirmVisible}
                onCancel={() => setIsActivateConfirmVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsActivateConfirmVisible(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="activate"
                        type="primary"
                        onClick={handleActivate}
                    >
                        Activate
                    </Button>,
                ]}
            >
                <p>
                    Are you sure you want to activate the user "<strong>{userToActivate?.email}</strong>"?
                </p>
            </Modal>
        </div>
    );
};

export default UserDashboard;
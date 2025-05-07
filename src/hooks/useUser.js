import { useState, useEffect } from 'react';
import userService from '../api/userService';

const useUser = ({ email, page = 0, size = 10, sort = 'id,desc' } = {}) => {
    const [userData, setUserData] = useState([]);
    const [pagination, setPagination] = useState({
        current: page,
        pageSize: size,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async (params = {}) => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers({ email, page, size, sort, ...params });
            if (response.code === '200') {
                setUserData(response.data.content || []);
                setPagination({
                    current: response.data.number,
                    pageSize: response.data.size,
                    total: response.data.totalElements,
                    totalPages: response.data.totalPages,
                });
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [email, page, size, sort]);

    const changePage = (newPage) => {
        fetchUsers({ page: newPage });
    };

    const refetch = () => {
        fetchUsers();
    };

    const searchByEmail = (emailValue) => {
        fetchUsers({ email: emailValue, page: 0 });
    };

    return {
        userData,
        pagination,
        loading,
        error,
        changePage,
        refetch,
        searchByEmail,
    };
};

export default useUser;
import { useState, useEffect } from 'react';
import categoryService from '../api/categoryService';

const useCategory = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryService.getAllCategories();
            if (response.code === '200') {
                setCategoryData(response.data || []);
            } else {
                throw new Error('Failed to fetch categories');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const refetch = () => {
        fetchCategories();
    };

    return {
        categoryData,
        loading,
        error,
        refetch,
    };
};

export default useCategory;
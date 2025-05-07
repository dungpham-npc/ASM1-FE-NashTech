import { useState, useEffect, useCallback, useRef } from 'react';
import productService from "../api/productService.js";

const useProduct = (initialParams = {}) => {
    const [productData, setProductData] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        current: 1,
        pageSize: 12,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({
        productName: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        categoryId: undefined,
        page: 0,
        size: 12,
        sort: 'id,desc',
        ...initialParams,
    });
    const isFetching = useRef(false);

    const fetchProducts = useCallback(async (params) => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching with params:', params);
            const response = await productService.getAllProducts(params);
            console.log('Response from API:', response);

            if (response && response.code === '200' && response.data) {
                setProductData(response.data.content || []);
                setPagination({
                    total: response.data.totalElements || 0,
                    current: (response.data.number || 0) + 1,
                    pageSize: response.data.size || 12,
                    totalPages: response.data.totalPages || 0,
                });
            } else {
                setError('Failed to fetch products');
                setProductData([]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message || 'An error occurred');
            setProductData([]);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, []);

    useEffect(() => {
        fetchProducts(searchParams);
    }, [fetchProducts, searchParams]);

    const updateSearchParams = useCallback((newParams) => {
        setSearchParams((prev) => ({
            ...prev,
            ...newParams,
            page: newParams.page !== undefined ? newParams.page : 0,
        }));
    }, []);

    const updateFilters = useCallback((filters) => {
        updateSearchParams({
            ...filters,
            page: 0,
        });
    }, [updateSearchParams]);

    const searchByName = useCallback((productName) => {
        updateSearchParams({ productName: productName || undefined });
    }, [updateSearchParams]);

    const changePage = useCallback((page) => {
        updateSearchParams({ page: page - 1 });
    }, [updateSearchParams]);

    const changePageSize = useCallback((size) => {
        updateSearchParams({ size, page: 0 });
    }, [updateSearchParams]);

    const resetFilters = useCallback(() => {
        const defaultParams = {
            productName: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            categoryId: undefined,
            page: 0,
            size: 12,
            sort: 'id,desc',
        };
        setSearchParams(defaultParams);
    }, []);

    const filterByCategory = useCallback((categoryId) => {
        updateSearchParams({ categoryId: categoryId || undefined });
    }, [updateSearchParams]);

    return {
        productData,
        pagination,
        loading,
        error,
        searchByName,
        changePage,
        changePageSize,
        resetFilters,
        filterByCategory,
        updateFilters,
        refetch: fetchProducts,
    };
};

export default useProduct;
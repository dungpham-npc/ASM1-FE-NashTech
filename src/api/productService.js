import axiosInstance from "./axios.js";
import endpoints from "./endpoint.js";

/**
 * Service for handling Product related API calls
 */
const productService = {
    /**
     * Get all products with optional filtering, paging, and sorting
     *
     * @param {Object} params - Query parameters
     * @param {string} [params.productName] - Optional product name for filtering
     * @param {number} [params.minPrice] - Minimum price filter
     * @param {number} [params.maxPrice] - Maximum price filter
     * @param {number} [params.categoryId] - Category ID filter
     * @param {number} [params.page=0] - Page number (zero-based)
     * @param {number} [params.size=12] - Page size
     * @param {string} [params.sort='id,desc'] - Sort parameter (field,direction)
     * @returns {Promise} - Promise with response data
     */
    getAllProducts: async (params = {}) => {
        try {
            const { productName, minPrice, maxPrice, categoryId, page = 0, size = 12, sort = 'id,desc', isFeatured } = params;

            const queryParams = new URLSearchParams();

            // Add optional parameters only if they exist
            if (productName) queryParams.append('productName', productName);
            if (minPrice !== undefined) queryParams.append('minPrice', minPrice);
            if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice);
            if (categoryId !== undefined) queryParams.append('categoryId', categoryId);
            if (isFeatured !== undefined) queryParams.append('isFeatured', isFeatured);
            queryParams.append('page', page);
            queryParams.append('size', size);
            queryParams.append('sort', sort);

            const response = await axiosInstance.get(`${endpoints.product.getAllProducts}?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error.response?.data || {
                message: 'An error occurred while fetching products',
            };
        }
    },

    /**
     * Get all categories
     *
     * @returns {Promise} - Promise with response data
     */
    getAllCategories: async () => {
        try {
            const response = await axiosInstance.get(endpoints.category.getAll);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error.response?.data || {
                message: 'An error occurred while fetching categories',
            };
        }
    },

    rateProduct: async (id, rating) => {
        try {
            const response = await axiosInstance.post(endpoints.product.rateProduct(id, rating));
            return response.data;
        } catch (error) {
            console.error('Error rating product:', error.message);
            throw error.message || {
                message: 'An error occurred while rating the product',
            };
        }
    },

    getProductById: async (id) => {
        try {
            const response = await axiosInstance.get(endpoints.product.getProductById(id));
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch product details');
        }
    },
    createProduct: async (formData) => {
        try {
            const response = await axiosInstance.post(endpoints.product.createProduct, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error.response?.data || { message: 'Failed to create product' };
        }
    },
    updateProduct: async (id, formData) => {
        try {
            const response = await axiosInstance.put(endpoints.product.updateProduct(id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error.response?.data || { message: 'Failed to update product' };
        }
    },
    deleteProduct: async (id) => {
        try {
            const response = await axiosInstance.delete(endpoints.product.deleteProduct(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error.response?.data || { message: 'Failed to delete product' };
        }
    },
};

export default productService;
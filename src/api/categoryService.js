import axiosInstance from "./axios.js";
import endpoints from "./endpoint.js";

const categoryService = {
    /**
     * Get all categories
     * @returns {Promise} - Promise with response data
     */
    getAllCategories: async () => {
        try {
            const response = await axiosInstance.get(endpoints.category.getAll);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error.response?.data || {
                message: 'An error occurred while fetching categories'
            };
        }
    },

    /**
     * Get category by ID
     * @param {number} id - Category ID
     * @returns {Promise} - Promise with response data
     */
    getCategoryById: async (id) => {
        try {
            const response = await axiosInstance.get(endpoints.category.getById(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error.message || {
                message: 'An error occurred while fetching the category'
            };
        }
    },

    /**
     * Create a new category
     * @param {Object} data - Category data
     * @returns {Promise} - Promise with response data
     */
    createCategory: async (data) => {
        try {
            const response = await axiosInstance.post(endpoints.category.create, data);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error.message);
            throw error.message || {
                message: 'An error occurred while creating the category'
            };
        }
    },

    /**
     * Update an existing category
     * @param {number} id - Category ID
     * @param {Object} data - Updated category data
     * @returns {Promise} - Promise with response data
     */
    updateCategory: async (id, data) => {
        try {
            const response = await axiosInstance.put(endpoints.category.update(id), data);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error.message || error.data.message || {
                message: 'An error occurred while updating the category'
            };
        }
    },

    /**
     * Delete a category
     * @param {number} id - Category ID
     * @returns {Promise} - Promise with response data
     */
    deleteCategory: async (id) => {
        try {
            const response = await axiosInstance.delete(endpoints.category.delete(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error.message);
            throw error.message || {
                message: 'An error occurred while deleting the category'
            };
        }
    },
};

export default categoryService;
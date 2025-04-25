import axiosInstance from "./axios.js";
import endpoints from "./endpoint.js";

const authService = {
    /**
     * Login user with email and password
     * @param {Object} credentials - User login credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @returns {Promise} - Promise with response data
     */
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post(endpoints.auth.login, credentials);
            console.log('Login response:', response.data);
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('user', response.data.data.role);

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error.response?.data || {
                message: 'An error occurred during login. Please try again.'
            } || error.response?.data.message;
        }
    },

    /**
     * Logout user by removing tokens and user data
     */
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // Optional: Call logout endpoint to invalidate token on server
        return axiosInstance.post(endpoints.auth.logout);
    },

    /**
     * Register a new user with email and password
     * @param {Object} credentials - User registration credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @returns {Promise} - Promise with response data
     */
    register: async (credentials) => {
        try {
            const response = await axiosInstance.post(endpoints.auth.register, {
                email: credentials.email?.trim(),
                password: credentials.password?.trim(),
                confirmPassword: credentials.confirmPassword?.trim(),
            });
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('user', response.data.data.role);

            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            const errorMessage =
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : null) ||
                error.message ||
                'An error occurred during registration. Please try again.';

            throw { message: errorMessage };
        }
    },

    /**
     * Get current authenticated user
     * @returns {Object|null} User data or null if not authenticated
     */
    getCurrentUser: () => {
        const userRoles = localStorage.getItem('user');
        if (!userRoles) return null;

        return userRoles;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated, false otherwise
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};

export default authService;
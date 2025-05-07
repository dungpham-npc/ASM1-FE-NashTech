import axiosInstance from "./axios.js";
// Import the endpoints from the endpoint module
import endpoints from "./endpoint.js";

/**
 * Service for handling User related API calls
 */
const userService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.name - User full name
   * @param {string} userData.phone - User phone number (10 digits)
   * @param {string} userData.password - User password
   * @param {string} [userData.gender] - User gender (MALE, FEMALE, OTHER)
   * @param {string} [userData.dateOfBirth] - User date of birth (YYYY-MM-DD)
   * @returns {Promise} - Promise with response data
   */
  register: async (userData) => {
    try {

      // Prepare registration payload with only email and password
      const registrationData = {
        email: userData.email?.trim(),
        password: userData.password?.trim(),
      };

      console.log('Sending registration data:', registrationData);

      const response = await axiosInstance.post(endpoints.auth.register, registrationData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || {
        message: 'An error occurred during registration. Please try again.',
      };
    }
  },


  /**
   * Initiate forgot password process
   * 
   * @param {Object} request - Forgot password request
   * @param {string} request.email - User email
   * @returns {Promise} - Promise with response data
   */
  forgotPassword: async (request) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.forgotPassword, request);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error.response?.data || { 
        message: 'An error occurred while processing your request. Please try again.' 
      };
    }
  },

  getCurrentUserProfile: async () => {
    const response = await axiosInstance.get(endpoints.auth.getProfile);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await axiosInstance.post(endpoints.auth.changePassword, data);
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await axiosInstance.post(endpoints.auth.verifyOTP, data);
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get(endpoints.user.getAll, { params });
    return response.data;
  },

  createUser: async (data) => {
    const response = await axiosInstance.post(endpoints.user.createUser, data);
    return response.data;
  },

  deactivateUser: async (id) => {
    const response = await axiosInstance.delete(endpoints.user.deactivateUser(id));
    return response.data;
  },

  activateUser: async (id) => {
    const response = await axiosInstance.put(endpoints.user.activateUser(id));
    return response.data;
  },


};

export default userService;
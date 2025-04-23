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

  /**
   * Resend OTP code
   * 
   * @param {Object} request - Resend OTP request
   * @param {string} request.email - User email
   * @returns {Promise} - Promise with response data
   */
  resendOTP: async (request) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.resendOTP, request);
      return response.data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error.response?.data || { 
        message: 'An error occurred while sending the OTP. Please try again.' 
      };
    }
  },

  /**
   * Confirm OTP code
   * 
   * @param {Object} request - Confirm OTP request
   * @param {string} request.email - User email
   * @param {string} request.otpCode - OTP code received
   * @param {string} request.newPassword - New password to set
   * @returns {Promise} - Promise with response data
   */
  confirmOTP: async (request) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.confirmOTP, request);
      return response.data;
    } catch (error) {
      console.error('Confirm OTP error:', error);
      throw error.response?.data || { 
        message: 'Invalid or expired OTP code. Please try again.' 
      };
    }
  },

  /**
   * Get all users with filtering, pagination, and sorting
   * @param {Object} criteria - Filter criteria for users
   * @returns {Promise} - Promise with paginated user data
   */
  getAllUsers: async (criteria) => {
    try {
      // Map frontend filter fields to backend expectations
      const backendCriteria = {
        currentPage: criteria.currentPage,
        pageSize: criteria.pageSize,
        // Map name to search
        search: criteria.name || '',
        email: criteria.email || '',
        phone: criteria.phone || ''
        // Note: role and isActive filters won't work unless added to backend
      };
      
      console.log('Sending user criteria:', backendCriteria);
      
      const response = await axiosInstance.post(endpoints.user.getAll, backendCriteria);
      return response.data;
    } catch (error) {
      console.error('Get users error:', error.response?.data || error);
      throw error.response?.data || { 
        message: 'An error occurred while fetching users.' 
      };
    }
  },

  /**
   * Set user as staff (admin only)
   * @param {number} userId - ID of user to promote to staff
   * @returns {Promise} - Promise with response data
   */
  setUserAsStaff: async (userId) => {
    try {
      const response = await axiosInstance.put(endpoints.user.setStaff(userId));
      return response.data;
    } catch (error) {
      console.error('Set staff error:', error);
      throw error.response?.data || { 
        message: 'An error occurred while updating user role.' 
      };
    }
  },

  /**
   * Update user active status (admin only)
   * @param {number} userId - ID of user to update
   * @param {boolean} isActive - Whether to activate or deactivate the user
   * @returns {Promise} - Promise with response data
   */
  updateUserActiveStatus: async (userId, isActive) => {
    try {
      const response = await axiosInstance.put(
        endpoints.user.updateActiveStatus(userId),
        null,
        { params: { isActive } }
      );
      return response.data;
    } catch (error) {
      console.error('Update user status error:', error);
      throw error.response?.data || { 
        message: 'An error occurred while updating user status.' 
      };
    }
  }
};

export default userService;
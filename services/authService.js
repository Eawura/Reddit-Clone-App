// authService.js

/**
 * AuthService object - using the new API functions
 */
export const AuthService = {
  // Use the authAPI functions directly
  login: authAPI.login,
  signup: authAPI.signup,
  logout: authAPI.logout,
  getCurrentUser: authAPI.getCurrentUser,
  isAuthenticated: authAPI.isAuthenticated,

  // Validation helpers
  validateUsername: (username) => {
    return username && username.length >= 3;
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password) => {
    return password.length >= 8;
  },
};

// Remove all the old duplicate functions (login, register, logout, etc.)
// Keep only the AuthService object

export default AuthService;

import { useEffect, useState } from "react";
import authService from "../api/authService.js";
import { AuthContext } from "./AuthContext.jsx";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state
    useEffect(() => {
        const initAuth = () => {
            try {
                const isAuthenticated = authService.isAuthenticated();
                if (isAuthenticated) {
                    // Get user role from localStorage
                    const userRole = localStorage.getItem("user");
                    setUser(userRole ? userRole : null);
                }
            } catch (err) {
                console.error("Failed to initialize auth:", err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(credentials);

            // Update user state after successful login
            if (response && response.metadata && response.metadata.roles) {
                setUser(response.metadata.roles);
            }

            return response;
        } catch (err) {
            setError(err.message || "Login failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (credentials) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.register(credentials);

            if (response && response.metadata && response.metadata.roles) {
                setUser(response.metadata.roles);
            }

            return response;
        } catch (err) {
            setError(err.message || "Registration failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            // Call the backend logout endpoint and wait for it to complete
            await authService.logout();

            // Clear user state
            setUser(null);

            // Clear any error state that might be present
            setError(null);

            // Notify the application about the auth state change
            window.dispatchEvent(new Event("authStateChanged"));

            console.log("User logged out successfully");
        } catch (err) {
            console.error("Logout error:", err);
            // Even if the server-side logout fails, we still want to clear local state
            setUser(null);
            window.dispatchEvent(new Event("authStateChanged"));
        }
    };

    // Check if user has a specific role
    const hasRole = (role) => {
        if (!user) return false;
        return user.includes(role);
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roles) => {
        if (!user) return false;
        return roles.some((role) => user.includes(role));
    };

    // Auth context value
    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
        isAdmin: user ? user.includes("ADMIN") : false,
        isCustomer: user ? user.includes("CUSTOMER") : false,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
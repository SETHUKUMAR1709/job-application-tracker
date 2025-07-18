import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Stores basic user info (e.g., id, username)
    const [token, setToken] = useState(null); // Stores the JWT token
    const [loading, setLoading] = useState(true); // Indicates if auth state is being loaded

    const API_BASE_URL = 'http://localhost:5000/api'; // Your backend API base URL

    // Effect to check for existing token and user data in localStorage on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUser = localStorage.getItem('user'); // User data might be stored as a stringified JSON

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                // Clear invalid data if parsing fails
                localStorage.removeItem('user');
                localStorage.removeItem('jwtToken');
            }
        }
        setLoading(false); // Authentication check is complete
    }, []); // Empty dependency array means this runs once on mount

    // Function to handle user login
    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('jwtToken', data.token); // Store the JWT token
            // In a real app, the backend might return user details with the token,
            // which you would decode or use directly. For now, we'll use a dummy.
            // You might decode the token here to get user.id and user.username
            const decodedUser = { id: data.userId || 'dummyUserId', username: username }; // Assuming backend returns userId or you decode from token
            localStorage.setItem('user', JSON.stringify(decodedUser)); // Store user info

            setToken(data.token);
            setUser(decodedUser);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    // Function to handle user registration
    const register = async (username, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    };

    // Function to handle user logout
    const logout = () => {
        localStorage.removeItem('jwtToken'); // Remove token from localStorage
        localStorage.removeItem('user');     // Remove user data from localStorage
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => useContext(AuthContext);

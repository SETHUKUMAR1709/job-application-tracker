import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // While authentication status is being determined, show a loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <p className="text-xl font-semibold text-gray-700">Loading authentication...</p>
            </div>
        );
    }

    // If authenticated, render the children components (the protected page)
    // Otherwise, redirect to the login page
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

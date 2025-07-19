import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your page components
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/DashboardPage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import ProfilePage from './pages/ProfilePage';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <JobProvider>
                    <NavBar />

                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<SignupPage />} />

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile/:userId"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/"
                            element={
                                <AuthRedirect />
                            }
                        />

                        <Route
                            path="*"
                            element={
                                <AuthRedirect />
                            }
                        />
                    </Routes>
                </JobProvider>
            </AuthProvider>
        </Router>
    );
};

const AuthRedirect = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <p className="text-xl font-semibold text-gray-700">Loading application...</p>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default App;

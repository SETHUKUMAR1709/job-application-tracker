import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <nav className="bg-gray-800 p-4 shadow-lg">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                {/* Brand/Logo - links to dashboard if authenticated, otherwise to login */}
                <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-white text-2xl font-bold tracking-wide">
                    Job Tracker
                </Link>

                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            {/* Display username */}
                            {user && (
                                <span className="text-gray-300 text-sm">Welcome, {user.username}!</span>
                            )}
                            {/* Dashboard link */}
                            <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                                Dashboard
                            </Link>
                            {/* Logout button */}
                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Login link */}
                            <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                                Login
                            </Link>
                            {/* Register link */}
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

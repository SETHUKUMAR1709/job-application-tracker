import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/NavBar.css';

const NavBar = () => {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <nav className="navbar-container">
            <div className="navbar-content">
                <Link to={isAuthenticated ? "/dashboard" : "/login"} className="navbar-brand">
                    Job Tracker
                </Link>

                <div className="navbar-links">
                    {isAuthenticated ? (
                        <>
                            {user && (
                                <span className="welcome-message">Welcome, {user.username}!</span>
                            )}
                            <Link to="/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                            {user && ( 
                                <Link to={`/profile/${user.id}`} className="nav-link">
                                    Profile
                                </Link>
                            )}
                            <button onClick={logout} className="logout-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/register" className="register-button">
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

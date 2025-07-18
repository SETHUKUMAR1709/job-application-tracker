import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import MessageDisplay from '../../components/MessageDisplay';
import '../../styles/LoginPage.css'; // Import the dedicated CSS file

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(username, password);
        if (result.success) {
            showMessage('Logged in successfully!', 'success');
            navigate('/dashboard');
        } else {
            showMessage(result.error || 'Login failed. Please check your credentials.', 'error');
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h2 className="login-title">Login to Your Account</h2>

                <MessageDisplay message={message} type={messageType} />

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="register-link">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import MessageDisplay from '../../components/MessageDisplay';
import '../../styles/SignupPage.css';

const SignupPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        if (password !== confirmPassword) {
            showMessage('Passwords do not match.', 'error');
            return;
        }

        const result = await register(username, password);
        if (result.success) {
            showMessage(result.message || 'Registration successful! Please log in.', 'success');
            navigate('/login');
        } else {
            showMessage(result.error || 'Registration failed.', 'error');
        }
    };

    return (
        <div className="signup-page-container">
            <div className="signup-card">
                <h2 className="signup-title">Register Account</h2>

                <MessageDisplay message={message} type={messageType} />

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
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
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <button type="submit" className="signup-button">
                        Register
                    </button>
                </form>
                <div className="signup-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="login-link">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

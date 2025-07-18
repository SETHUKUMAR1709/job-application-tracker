import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import MessageDisplay from '../../components/MessageDisplay';

const SignupPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Function to display temporary messages (success/error)
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000); 
    };

    // Handler for form submission (registration)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showMessage('Passwords do not match.', 'error');
            return;
        }

        const result = await register(username, password);
        if (result.success) {
            showMessage(result.message || 'Registration successful! Please log in.', 'success');
            // After successful registration, navigate to the login page
            navigate('/login');
        } else {
            showMessage(result.error || 'Registration failed.', 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register Account</h2>

                {/* Message display area for success/error alerts */}
                <MessageDisplay message={message} type={messageType} />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

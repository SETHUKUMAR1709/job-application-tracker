import React from 'react';
import '../styles/MessageDisplay.css';

const MessageDisplay = ({ message, type }) => {
    if (!message) return null;

    return (
        <div className={`message-display ${type === 'success' ? 'message-success' : 'message-error'}`}>
            {message}
        </div>
    );
};

export default MessageDisplay;

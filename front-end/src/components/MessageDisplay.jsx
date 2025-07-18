import React from 'react';

const MessageDisplay = ({ message, type }) => {
    // If there's no message, don't render anything
    if (!message) return null;

    // Determine the styling based on the message type (success or error)
    const baseClasses = "p-3 mb-4 rounded-md text-center text-sm";
    const typeClasses = type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            {message}
        </div>
    );
};

export default MessageDisplay;

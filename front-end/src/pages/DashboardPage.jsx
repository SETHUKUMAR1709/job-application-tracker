import React, { useState } from 'react';
import JobForm from '../components/JobForm';
import JobList from '../components/JobList';
import FilterBar from '../components/FilterBar';
import MessageDisplay from '../components/MessageDisplay';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { logout, user } = useAuth();
    const [filterStatus, setFilterStatus] = useState('All');
    const [editingJob, setEditingJob] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Function to display temporary messages (success/error)
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000); // Message disappears after 3 seconds
    };

    // Handler for when a user clicks the "Edit" button on a job item
    const handleEditJob = (job) => {
        setEditingJob(job); // Set the job to be edited in the form
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top where the form is
    };

    // Handler for canceling the edit operation
    const handleCancelEdit = () => {
        setEditingJob(null); // Clear the editing job state
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6 sm:p-8 my-8">
            {/* Header section with title, welcome message, and logout button */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Job Application Tracker</h1>
                <div className="flex items-center space-x-4">
                    {/* Display username if available */}
                    {user && <span className="text-gray-600 text-sm">Welcome, {user.username || 'User'}!</span>}
                    {/* Logout button */}
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Message display area for success/error alerts */}
            <MessageDisplay message={message} type={messageType} />

            {/* Job Form component for adding new jobs or editing existing ones */}
            <JobForm
                editingJob={editingJob} // Pass the job currently being edited
                onCancelEdit={handleCancelEdit} // Callback to cancel editing
                onSuccess={(msg) => showMessage(msg, 'success')} // Callback for success messages
                onError={(msg) => showMessage(msg, 'error')} // Callback for error messages
            />

            {/* Filter Bar component to filter jobs by status */}
            <FilterBar filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

            {/* Job List component to display job applications */}
            <JobList
                filterStatus={filterStatus} // Pass the current filter status
                onEditJob={handleEditJob} // Callback when a job needs to be edited
                onDeleteSuccess={(msg) => showMessage(msg, 'success')} // Callback for successful deletion
                onDeleteError={(msg) => showMessage(msg, 'error')} // Callback for deletion errors
            />
        </div>
    );
};

export default DashboardPage;

import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Applied');
    const [resumeFile, setResumeFile] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [editingJob, setEditingJob] = useState(null);
    const [showTimelineModal, setShowTimelineModal] = useState(false);
    const [selectedJobTimeline, setSelectedJobTimeline] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const userId = 'dummyUserId123'; // Replace with actual user ID from authentication

    const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend URL

    const jobStatuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

    // Fetch jobs from backend API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // In a real app, you'd send a JWT token in the Authorization header
                const response = await fetch(`${API_BASE_URL}/jobs?userId=${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                showMessage("Error fetching jobs.", "error");
            }
        };
        fetchJobs();
    }, [userId]); // Re-fetch if userId changes (e.g., after login/logout)

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000); // Message disappears after 3 seconds
    };

    const handleAddOrUpdateJob = async (e) => {
        e.preventDefault();

        if (!company || !role) {
            showMessage("Company and Role are required.", "error");
            return;
        }

        const formData = new FormData();
        formData.append('company', company);
        formData.append('role', role);
        formData.append('status', status);
        formData.append('userId', userId); // Associate job with user
        if (resumeFile) {
            formData.append('resume', resumeFile);
        }

        // Handle status history logic (client-side for now, or send to backend for server-side logic)
        let newStatusHistory = editingJob
            ? [...(editingJob.statusHistory || [])]
            : [{ status: 'Applied', timestamp: new Date().toISOString() }]; // ISO string for backend

        if (editingJob && editingJob.status !== status) {
            newStatusHistory.push({ status: status, timestamp: new Date().toISOString() });
        } else if (!editingJob && status !== 'Applied') {
            newStatusHistory.push({ status: status, timestamp: new Date().toISOString() });
        }
        formData.append('statusHistory', JSON.stringify(newStatusHistory)); // Stringify array for FormData

        try {
            let response;
            if (editingJob) {
                response = await fetch(`${API_BASE_URL}/jobs/${editingJob.id}`, {
                    method: 'PUT',
                    // No 'Content-Type': 'application/json' when sending FormData
                    body: formData,
                    // In a real app, send JWT token:
                    // headers: { 'Authorization': `Bearer ${yourJwtToken}` }
                });
            } else {
                response = await fetch(`${API_BASE_URL}/jobs`, {
                    method: 'POST',
                    body: formData,
                    // In a real app, send JWT token:
                    // headers: { 'Authorization': `Bearer ${yourJwtToken}` }
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            showMessage(editingJob ? "Job updated successfully!" : "Job added successfully!", "success");

            // Re-fetch jobs to update the list
            const updatedJobsResponse = await fetch(`${API_BASE_URL}/jobs?userId=${userId}`);
            const updatedJobsData = await updatedJobsResponse.json();
            setJobs(updatedJobsData);

            // Reset form
            setCompany('');
            setRole('');
            setStatus('Applied');
            setResumeFile(null);
            setEditingJob(null);
            document.getElementById('resume-upload').value = ''; // Clear file input
        } catch (error) {
            console.error("Error adding/updating job:", error);
            showMessage(`Error: ${error.message}`, "error");
        }
    };

    const handleEditJob = (job) => {
        setEditingJob(job);
        setCompany(job.company);
        setRole(job.role);
        setStatus(job.status);
    };

    const handleDeleteJob = async (jobId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'DELETE',
                // In a real app, send JWT token:
                // headers: { 'Authorization': `Bearer ${yourJwtToken}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            showMessage("Job deleted successfully!", "success");
            setJobs(jobs.filter(job => job.id !== jobId)); // Optimistic update
        } catch (error) {
            console.error("Error deleting job:", error);
            showMessage(`Error: ${error.message}`, "error");
        }
    };

    const handleViewTimeline = (job) => {
        // Parse timestamps if they are strings from the backend
        const timeline = job.statusHistory ? job.statusHistory.map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp) // Convert ISO string back to Date object
        })).sort((a, b) => a.timestamp - b.timestamp) : [];
        setSelectedJobTimeline(timeline);
        setShowTimelineModal(true);
    };

    const filteredJobs = filterStatus === 'All'
        ? jobs
        : jobs.filter(job => job.status === filterStatus);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6 sm:p-8">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Job Application Tracker</h1>

                {message && (
                    <div className={`p-3 mb-4 rounded-md text-center text-sm ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                {userId && (
                    <div className="text-center text-sm text-gray-600 mb-6">
                        Your User ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded-md">{userId}</span>
                    </div>
                )}

                {/* Add/Edit Job Form */}
                <form onSubmit={handleAddOrUpdateJob} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">{editingJob ? 'Edit Job Application' : 'Add New Job Application'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <input
                                type="text"
                                id="company"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Google"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input
                                type="text"
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Software Engineer"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                {jobStatuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-1">Resume (Optional)</label>
                            <input
                                type="file"
                                id="resume-upload"
                                onChange={(e) => setResumeFile(e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {editingJob?.resumeUrl && (
                                <p className="text-xs text-gray-500 mt-1">Current resume uploaded. Uploading a new one will replace it.</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {editingJob ? 'Update Job' : 'Add Job'}
                    </button>
                    {editingJob && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingJob(null);
                                setCompany('');
                                setRole('');
                                setStatus('Applied');
                                setResumeFile(null);
                                document.getElementById('resume-upload').value = '';
                            }}
                            className="w-full mt-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Cancel Edit
                        </button>
                    )}
                </form>

                {/* Filter Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Filter Applications</h2>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterStatus('All')}
                            className={`px-4 py-2 rounded-md font-semibold transition duration-200 ${filterStatus === 'All' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            All
                        </button>
                        {jobStatuses.map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-2 rounded-md font-semibold transition duration-200 ${filterStatus === s ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job List */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Applications ({filterStatus} Jobs)</h2>
                    {filteredJobs.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">No job applications found for this filter.</p>
                    ) : (
                        <ul className="space-y-4">
                            {filteredJobs.map(job => (
                                <li key={job.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-blue-500">
                                    <div className="flex-grow mb-2 sm:mb-0">
                                        <h3 className="text-lg font-semibold text-gray-800">{job.company} - {job.role}</h3>
                                        <p className="text-gray-600 text-sm">Status: <span className={`font-medium ${
                                            job.status === 'Applied' ? 'text-blue-600' :
                                            job.status === 'Interview' ? 'text-purple-600' :
                                            job.status === 'Offer' ? 'text-green-600' :
                                            'text-red-600'
                                        }`}>{job.status}</span></p>
                                        {job.resumeUrl && (
                                            <a href={job.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm flex items-center mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                </svg>
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditJob(job)}
                                            className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition duration-200"
                                            title="Edit Job"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleViewTimeline(job)}
                                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition duration-200"
                                            title="View Timeline"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M9 15h.01M15 15h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition duration-200"
                                            title="Delete Job"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Timeline Modal */}
            {showTimelineModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Status Timeline</h2>
                        <button
                            onClick={() => setShowTimelineModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {selectedJobTimeline.length === 0 ? (
                            <p className="text-gray-600">No status changes recorded yet.</p>
                        ) : (
                            <ol className="relative border-l border-gray-200 ml-3">
                                {selectedJobTimeline.map((entry, index) => (
                                    <li key={index} className="mb-4 ml-6">
                                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M9 15h.01M15 15h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </span>
                                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                                            {entry.status}
                                        </h3>
                                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                                            {entry.timestamp?.toLocaleString()}
                                        </time>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

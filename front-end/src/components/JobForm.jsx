import React, { useState, useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import MessageDisplay from './MessageDisplay'; // Assuming MessageDisplay is also in components

const JobForm = ({ editingJob, onCancelEdit, onSuccess, onError }) => {
    const { addJob, updateJob, loadingJobs, errorJobs } = useJobs();
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Applied');
    const [resumeFile, setResumeFile] = useState(null);

    const jobStatuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

    // Effect to populate form fields when an existing job is selected for editing
    useEffect(() => {
        if (editingJob) {
            setCompany(editingJob.company);
            setRole(editingJob.role);
            setStatus(editingJob.status);
            setResumeFile(null); // Clear file input when editing, user can re-upload
        } else {
            // Reset form fields when no job is being edited
            setCompany('');
            setRole('');
            setStatus('Applied');
            setResumeFile(null);
        }
        // Clear the actual file input element directly to ensure it resets
        const fileInput = document.getElementById('resume-upload');
        if (fileInput) fileInput.value = '';
    }, [editingJob]); // Re-run this effect whenever editingJob changes

    // Handler for form submission (add or update job)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!company || !role) {
            onError("Company and Role are required.");
            return;
        }

        // Prepare status history for the job
        let newStatusHistory = editingJob
            ? [...(editingJob.statusHistory || [])] // Copy existing history if editing
            : [{ status: 'Applied', timestamp: new Date().toISOString() }]; // Default for new job

        // Add a new status entry if the status has changed during editing, or if it's a new job and not 'Applied'
        if (editingJob && editingJob.status !== status) {
            newStatusHistory.push({ status: status, timestamp: new Date().toISOString() });
        } else if (!editingJob && status !== 'Applied') {
            // This case handles if a new job is added with an initial status other than 'Applied'
            newStatusHistory.push({ status: status, timestamp: new Date().toISOString() });
        }

        const jobData = {
            company,
            role,
            status,
            // Stringify statusHistory because FormData can only append strings or Blobs
            statusHistory: JSON.stringify(newStatusHistory),
        };

        let result;
        if (editingJob) {
            // If editingJob exists, call the updateJob function from context
            result = await updateJob(editingJob.id, jobData, resumeFile);
            if (result.success) {
                onSuccess("Job updated successfully!");
                onCancelEdit(); // Exit edit mode after successful update
            } else {
                onError(result.error || "Failed to update job.");
            }
        } else {
            // If no editingJob, call the addJob function from context
            result = await addJob(jobData, resumeFile);
            if (result.success) {
                onSuccess("Job added successfully!");
                // Reset form fields after successful addition
                setCompany('');
                setRole('');
                setStatus('Applied');
                setResumeFile(null);
                const fileInput = document.getElementById('resume-upload');
                if (fileInput) fileInput.value = '';
            } else {
                onError(result.error || "Failed to add job.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">{editingJob ? 'Edit Job Application' : 'Add New Job Application'}</h2>

            {/* Display loading or error messages from JobContext */}
            {loadingJobs && <MessageDisplay message="Processing job..." type="info" />}
            {errorJobs && <MessageDisplay message={errorJobs} type="error" />}

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
                disabled={loadingJobs} // Disable button while processing
            >
                {editingJob ? 'Update Job' : 'Add Job'}
            </button>
            {editingJob && (
                <button
                    type="button"
                    onClick={onCancelEdit}
                    className="w-full mt-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    disabled={loadingJobs} // Disable button while processing
                >
                    Cancel Edit
                </button>
            )}
        </form>
    );
};

export default JobForm;

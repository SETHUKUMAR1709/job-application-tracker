import React, { useState, useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import MessageDisplay from './MessageDisplay';
import '../styles/JobForm.css';

const JobForm = ({ editingJob, onCancelEdit, onSuccess, onError }) => {
    const { addJob, updateJob, loadingJobs, errorJobs } = useJobs();
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Applied');
    const [resumeFile, setResumeFile] = useState(null);

    const jobStatuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

    useEffect(() => {
        if (editingJob) {
            setCompany(editingJob.company);
            setRole(editingJob.role);
            setStatus(editingJob.status);
            setResumeFile(null);
        } else {
            setCompany('');
            setRole('');
            setStatus('Applied');
            setResumeFile(null);
        }
        const fileInput = document.getElementById('resume-upload');
        if (fileInput) fileInput.value = '';
    }, [editingJob]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!company || !role) {
            onError("Company and Role are required.");
            return;
        }

        let newStatusHistory = editingJob
            ? [...(editingJob.statusHistory || [])]
            : [{ status: 'Applied', timestamp: new Date().toISOString() }];

        if (editingJob && editingJob.status !== status) {
            newStatusHistory.push({ status: status, timestamp: new Date().toISOString() });
        } else if (!editingJob && status !== 'Applied') {
            newStatusHistory.push({ status: status, timestamp: new Date().toISOString() });
        }

        const jobData = {
            company,
            role,
            status,
            statusHistory: JSON.stringify(newStatusHistory),
        };

        let result;
        if (editingJob) {
            result = await updateJob(editingJob.id, jobData, resumeFile);
            if (result.success) {
                onSuccess("Job updated successfully!");
                onCancelEdit();
            } else {
                onError(result.error || "Failed to update job.");
            }
        } else {
            result = await addJob(jobData, resumeFile);
            if (result.success) {
                onSuccess("Job added successfully!");
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
        <form onSubmit={handleSubmit} className="job-form-container">
            <h2 className="job-form-title">{editingJob ? 'Edit Job Application' : 'Add New Job Application'}</h2>

            {loadingJobs && <MessageDisplay message="Processing job..." type="info" />}
            {errorJobs && <MessageDisplay message={errorJobs} type="error" />}

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                        type="text"
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g., Google"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                        type="text"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g., Software Engineer"
                        required
                    />
                </div>
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {jobStatuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="resume-upload">Resume (Optional)</label>
                    <input
                        type="file"
                        id="resume-upload"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="file-input"
                    />
                    {editingJob?.resumeUrl && (
                        <p className="resume-info">Current resume uploaded. Uploading a new one will replace it.</p>
                    )}
                </div>
            </div>
            <button
                type="submit"
                className="submit-button"
                disabled={loadingJobs}
            >
                {editingJob ? 'Update Job' : 'Add Job'}
            </button>
            {editingJob && (
                <button
                    type="button"
                    onClick={onCancelEdit}
                    className="cancel-button"
                    disabled={loadingJobs}
                >
                    Cancel Edit
                </button>
            )}
        </form>
    );
};

export default JobForm;

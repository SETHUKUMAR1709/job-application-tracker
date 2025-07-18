import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
    const { user, token, isAuthenticated } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [errorJobs, setErrorJobs] = useState(null);

    const API_BASE_URL = 'http://localhost:5000/api'; // Your backend API base URL

    // Function to fetch job applications from the backend
    const fetchJobs = async () => {
        // Only fetch jobs if authenticated and user ID is available
        if (!isAuthenticated || !user?.id) {
            setJobs([]); // Clear jobs if not authenticated or user ID is missing
            setLoadingJobs(false); // Ensure loading state is reset
            return;
        }

        setLoadingJobs(true); // Set loading state to true
        setErrorJobs(null); // Clear any previous errors
        try {
            const response = await fetch(`${API_BASE_URL}/jobs?userId=${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token for authentication
                },
            });
            if (!response.ok) {
                // If response is not OK, throw an error
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setJobs(data); // Update jobs state with fetched data
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setErrorJobs(error.message); // Set error message
        } finally {
            setLoadingJobs(false); // Reset loading state
        }
    };

    // Effect to trigger fetching jobs whenever authentication state or user/token changes
    useEffect(() => {
        fetchJobs();
    }, [isAuthenticated, user, token]); // Dependencies: re-run if these values change

    // Function to add a new job application
    const addJob = async (jobData, resumeFile) => {
        if (!isAuthenticated || !user?.id) {
            setErrorJobs('Not authenticated to add job.');
            return { success: false, error: 'Not authenticated' };
        }
        setLoadingJobs(true);
        setErrorJobs(null);

        const formData = new FormData();
        // Append all job data fields to FormData
        for (const key in jobData) {
            formData.append(key, jobData[key]);
        }
        formData.append('userId', user.id); // Associate job with the current user
        if (resumeFile) {
            formData.append('resume', resumeFile); // Append resume file if provided
        }

        try {
            const response = await fetch(`${API_BASE_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token
                },
                body: formData, // Send FormData for file uploads and other data
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add job');
            }
            const newJob = await response.json();
            // Update jobs state by adding the new job.
            // Map _id to id for consistency with frontend expectations.
            setJobs(prevJobs => [...prevJobs, { ...newJob.job, id: newJob.job._id }]);
            return { success: true };
        } catch (error) {
            console.error('Error adding job:', error);
            setErrorJobs(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoadingJobs(false);
        }
    };

    // Function to update an existing job application
    const updateJob = async (jobId, updatedData, resumeFile) => {
        if (!isAuthenticated || !user?.id) {
            setErrorJobs('Not authenticated to update job.');
            return { success: false, error: 'Not authenticated' };
        }
        setLoadingJobs(true);
        setErrorJobs(null);

        const formData = new FormData();
        // Append updated job data fields to FormData
        for (const key in updatedData) {
            formData.append(key, updatedData[key]);
        }
        if (resumeFile) {
            formData.append('resume', resumeFile); // Append new resume file if provided
        }

        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token
                },
                body: formData, // Send FormData
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update job');
            }
            const updatedJob = await response.json();
            // Update jobs state by mapping the updated job
            setJobs(prevJobs => prevJobs.map(job =>
                job.id === jobId ? { ...updatedJob.job, id: updatedJob.job._id } : job
            ));
            return { success: true };
        } catch (error) {
            console.error('Error updating job:', error);
            setErrorJobs(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoadingJobs(false);
        }
    };

    // Function to delete a job application
    const deleteJob = async (jobId) => {
        if (!isAuthenticated || !user?.id) {
            setErrorJobs('Not authenticated to delete job.');
            return { success: false, error: 'Not authenticated' };
        }
        setLoadingJobs(true);
        setErrorJobs(null);
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete job');
            }
            // Remove the deleted job from the state
            setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
            return { success: true };
        } catch (error) {
            console.error('Error deleting job:', error);
            setErrorJobs(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoadingJobs(false);
        }
    };

    return (
        <JobContext.Provider value={{ jobs, loadingJobs, errorJobs, fetchJobs, addJob, updateJob, deleteJob }}>
            {children}
        </JobContext.Provider>
    );
};

// Custom hook to easily consume the JobContext
export const useJobs = () => useContext(JobContext);

import React, { useState } from 'react';
import JobItem from './JobItem';
import TimelineModal from './TimelineModal';
import MessageDisplay from './MessageDisplay';
import { useJobs } from '../context/JobContext';
import '../styles/JobList.css';

const JobList = ({ filterStatus, onEditJob, onDeleteSuccess, onDeleteError }) => {
    const { jobs, loadingJobs, errorJobs, deleteJob } = useJobs();
    const [showTimelineModal, setShowTimelineModal] = useState(false);
    const [selectedJobTimeline, setSelectedJobTimeline] = useState([]);
    const [selectedJobCompany, setSelectedJobCompany] = useState('');

    const filteredJobs = filterStatus === 'All'
        ? jobs
        : jobs.filter(job => job.status === filterStatus);

    const handleViewTimeline = (job) => {
        const timeline = job.statusHistory ? job.statusHistory.map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
        })).sort((a, b) => a.timestamp - b.timestamp) : [];
        setSelectedJobTimeline(timeline);
        setSelectedJobCompany(job.company);
        setShowTimelineModal(true);
    };

    const handleDelete = async (jobId) => {
        const result = await deleteJob(jobId);
        if (result.success) {
            onDeleteSuccess("Job deleted successfully!");
        } else {
            onDeleteError(result.error || "Failed to delete job.");
        }
    };

    if (loadingJobs) {
        return <p className="job-list-loading">Loading jobs...</p>;
    }

    if (errorJobs) {
        return <MessageDisplay message={`Error loading jobs: ${errorJobs}`} type="error" />;
    }

    return (
        <div className="job-list-container">
            <h2 className="job-list-title">Your Applications ({filterStatus} Jobs)</h2>
            {filteredJobs.length === 0 ? (
                <p className="job-list-empty">No job applications found for this filter.</p>
            ) : (
                <ul className="job-list-items">
                    {filteredJobs.map(job => (
                        <JobItem
                            key={job.id}
                            job={job}
                            onEdit={onEditJob}
                            onDelete={handleDelete}
                            onViewTimeline={handleViewTimeline}
                        />
                    ))}
                </ul>
            )}

            {showTimelineModal && (
                <TimelineModal
                    companyName={selectedJobCompany}
                    timeline={selectedJobTimeline}
                    onClose={() => setShowTimelineModal(false)}
                />
            )}
        </div>
    );
};

export default JobList;

import React, { useState } from 'react';
import JobItem from './JobItem';
import TimelineModal from './TimelineModal';
import { useJobs } from '../context/JobContext';
import MessageDisplay from './MessageDisplay'; // Import MessageDisplay

const JobList = ({ filterStatus, onEditJob, onDeleteSuccess, onDeleteError }) => {
    const { jobs, loadingJobs, errorJobs, deleteJob } = useJobs();
    const [showTimelineModal, setShowTimelineModal] = useState(false);
    const [selectedJobTimeline, setSelectedJobTimeline] = useState([]);
    const [selectedJobCompany, setSelectedJobCompany] = useState('');

    // Filter jobs based on the selected status
    const filteredJobs = filterStatus === 'All'
        ? jobs
        : jobs.filter(job => job.status === filterStatus);

    // Handler to prepare and show the timeline modal for a selected job
    const handleViewTimeline = (job) => {
        // Ensure timestamps are Date objects for proper sorting and display
        const timeline = job.statusHistory ? job.statusHistory.map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
        })).sort((a, b) => a.timestamp - b.timestamp) : [];
        setSelectedJobTimeline(timeline);
        setSelectedJobCompany(job.company);
        setShowTimelineModal(true);
    };

    // Handler to delete a job
    const handleDelete = async (jobId) => {
        const result = await deleteJob(jobId);
        if (result.success) {
            onDeleteSuccess("Job deleted successfully!");
        } else {
            onDeleteError(result.error || "Failed to delete job.");
        }
    };

    // Display loading message while jobs are being fetched
    if (loadingJobs) {
        return <p className="text-gray-600 text-center py-4">Loading jobs...</p>;
    }

    // Display error message if fetching jobs failed
    if (errorJobs) {
        return <MessageDisplay message={`Error loading jobs: ${errorJobs}`} type="error" />;
    }

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Applications ({filterStatus} Jobs)</h2>
            {filteredJobs.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No job applications found for this filter.</p>
            ) : (
                <ul className="space-y-4">
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

            {/* Timeline Modal component, shown conditionally */}
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

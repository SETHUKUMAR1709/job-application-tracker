import React, { useState } from 'react';
import JobForm from '../components/JobForm';
import JobList from '../components/JobList';
import FilterBar from '../components/FilterBar';
import MessageDisplay from '../components/MessageDisplay';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [editingJob, setEditingJob] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    const handleEditJob = (job) => {
        setEditingJob(job);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingJob(null);
    };

    return (
        <div className="dashboard-page-container">
            <div className="dashboard-content-wrapper">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Job Application Tracker</h1>
                </div>

                <MessageDisplay message={message} type={messageType} />

                <JobForm
                    editingJob={editingJob}
                    onCancelEdit={handleCancelEdit}
                    onSuccess={(msg) => showMessage(msg, 'success')}
                    onError={(msg) => showMessage(msg, 'error')}
                />

                <FilterBar filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

                <JobList
                    filterStatus={filterStatus}
                    onEditJob={handleEditJob}
                    onDeleteSuccess={(msg) => showMessage(msg, 'success')}
                    onDeleteError={(msg) => showMessage(msg, 'error')}
                />
            </div>
        </div>
    );
};

export default DashboardPage;

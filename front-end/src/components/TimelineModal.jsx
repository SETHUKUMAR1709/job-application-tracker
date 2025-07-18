import React from 'react';
import '../styles/TimelineModal.css';

const TimelineModal = ({ companyName, timeline, onClose }) => {
    return (
        <div className="timeline-modal-overlay">
            <div className="timeline-modal-content">
                <h2 className="timeline-modal-title">Timeline for {companyName}</h2>
                <button
                    onClick={onClose}
                    className="timeline-modal-close-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="timeline-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {timeline.length === 0 ? (
                    <p className="timeline-empty-message">No status changes recorded yet.</p>
                ) : (
                    <ol className="timeline-list">
                        {timeline.map((entry, index) => (
                            <li key={index} className="timeline-item">
                                <span className="timeline-icon-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="timeline-item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M9 15h.01M15 15h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <h3 className="timeline-item-status">
                                    {entry.status}
                                </h3>
                                <time className="timeline-item-timestamp">
                                    {entry.timestamp?.toLocaleString()}
                                </time>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
};

export default TimelineModal;

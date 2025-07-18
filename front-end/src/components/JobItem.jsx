import React from 'react';

const JobItem = ({ job, onEdit, onDelete, onViewTimeline }) => {
    return (
        <li className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-blue-500">
            <div className="flex-grow mb-2 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">{job.company} - {job.role}</h3>
                <p className="text-gray-600 text-sm">Status: <span className={`font-medium ${
                    job.status === 'Applied' ? 'text-blue-600' :
                    job.status === 'Interview' ? 'text-purple-600' :
                    job.status === 'Offer' ? 'text-green-600' :
                    'text-red-600'
                }`}>{job.status}</span></p>
                {/* Display link to resume if available */}
                {job.resumeUrl && (
                    <a href={`http://localhost:5000${job.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        View Resume
                    </a>
                )}
            </div>
            <div className="flex space-x-2">
                {/* Edit button */}
                <button
                    onClick={() => onEdit(job)}
                    className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition duration-200"
                    title="Edit Job"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
                {/* View Timeline button */}
                <button
                    onClick={() => onViewTimeline(job)}
                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition duration-200"
                    title="View Timeline"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M9 15h.01M15 15h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </button>
                {/* Delete button */}
                <button
                    onClick={() => onDelete(job.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition duration-200"
                    title="Delete Job"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </li>
    );
};

export default JobItem;

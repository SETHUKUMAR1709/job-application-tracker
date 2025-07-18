import React from 'react';

const TimelineModal = ({ companyName, timeline, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Timeline for {companyName}</h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {timeline.length === 0 ? (
                    <p className="text-gray-600">No status changes recorded yet.</p>
                ) : (
                    <ol className="relative border-l border-gray-200 ml-3">
                        {timeline.map((entry, index) => (
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
    );
};

export default TimelineModal;

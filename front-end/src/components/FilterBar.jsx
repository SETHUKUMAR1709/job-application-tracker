import React from 'react';

const FilterBar = ({ filterStatus, setFilterStatus }) => {
    const jobStatuses = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Filter Applications</h2>
            <div className="flex flex-wrap gap-2">
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
    );
};

export default FilterBar;

import React from 'react';
import '../styles/FilterBar.css';

const FilterBar = ({ filterStatus, setFilterStatus }) => {
    const jobStatuses = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

    return (
        <div className="filter-bar-container">
            <h2 className="filter-bar-title">Filter Applications</h2>
            <div className="filter-buttons">
                {jobStatuses.map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`filter-button ${filterStatus === s ? 'filter-button-active' : ''}`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;

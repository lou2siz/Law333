import React, { useState } from 'react';
import ComplaintCard from './ComplaintCard';

function ComplaintGrid({ complaints }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [viewMode, setViewMode] = useState('grid');

    const filteredComplaints = complaints.filter(complaint => 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="App">
            <div className="news-dashboard">
                <div className="news-title">
                    <i className="fas fa-newspaper"></i>
                    Dashboard News
                </div>
                <div className="news-items">
                    <div className="news-item">
                        New case received: {complaints[0]?.title}
                    </div>
                    <div className="news-item">
                        Next deadline: {
                            complaints.reduce((nearest, complaint) => {
                                const date = new Date(complaint.nextRequestDate);
                                return !nearest || date < new Date(nearest) ? complaint.nextRequestDate : nearest;
                            }, null)
                        }
                    </div>
                    <div className="news-item">
                        Active cases: {complaints.length}
                    </div>
                </div>
            </div>

            <div className="dashboard-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search cases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="date">Recent First</option>
                        <option value="title">Case Name</option>
                        <option value="status">Status</option>
                    </select>
                </div>

                <div className="view-controls">
                    <button 
                        className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid View
                    </button>
                    <button 
                        className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        List View
                    </button>
                </div>
            </div>

            <div className={`complaint-container ${viewMode}`}>
                {filteredComplaints.map((complaint, index) => (
                    <ComplaintCard 
                        key={index} 
                        complaint={complaint} 
                        index={index}
                        viewMode={viewMode}
                    />
                ))}
            </div>
        </div>
    );
}

export default ComplaintGrid; 
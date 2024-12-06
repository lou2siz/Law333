import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import Login from './components/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate loading data
        setIsLoading(true);
        setTimeout(() => {
            try {
                // Your data loading logic here
                setComplaints([
                    // Your complaint data
                ]);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load data. Please try again.');
                setIsLoading(false);
            }
        }, 1500);
    }, []);

    if (!isAuthenticated) {
        return <Login onLogin={setIsAuthenticated} />;
    }

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<ComplaintGrid complaints={complaints} />} />
                <Route path="/complaint/:id" element={<ComplaintDetail complaints={complaints} />} />
            </Routes>
        </Router>
    );
}

function ComplaintGrid({ complaints }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [viewMode, setViewMode] = useState('grid');

    const filteredComplaints = complaints.filter(complaint => 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="App">
            <header className="app-header">
                <img src={`${process.env.PUBLIC_URL}/Logo.png`} alt="Logo" className="logo" />
                <h1>Lawsist View</h1>
            </header>

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

function ComplaintCard({ complaint, index, viewMode }) {
    const navigate = useNavigate();
    const dueDate = new Date('2024-11-16');
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    const [status, setStatus] = useState('Pending Lawyer Review');
    
    const getStatusClass = () => {
        if (daysUntilDue < 0) return 'status-overdue';
        if (daysUntilDue < 7) return 'status-urgent';
        return 'status-normal';
    };

    const getStatusColor = () => {
        switch(status) {
            case 'Lawyer Accepted': return 'status-accepted';
            case 'Lawyer Rejected': return 'status-rejected';
            default: return 'status-pending';
        }
    };

    const handleStatusChange = (e) => {
        e.stopPropagation();
        const nextStatus = {
            'Pending Lawyer Review': 'Lawyer Accepted',
            'Lawyer Accepted': 'Lawyer Rejected',
            'Lawyer Rejected': 'Pending Lawyer Review'
        }[status];
        setStatus(nextStatus);
    };

    return (
        <div 
            className={`complaint-card ${viewMode} ${getStatusClass()}`}
            onClick={() => navigate(`/complaint/${index}`)}
        >
            <div className="card-header">
                <div className="case-number">Case #{index + 1}</div>
                <div className={`status-badge ${getStatusClass()}`}>
                    {daysUntilDue < 0 ? 'Overdue' : 
                     daysUntilDue < 7 ? 'Urgent' : 'Active'}
                </div>
            </div>

            <div className="card-content">
                <h3 className="case-title">{complaint.title}</h3>
                
                <div className="case-meta">
                    <div className="meta-item">
                        <span className="meta-label">Next Action:</span>
                        <span className="meta-value">{complaint.nextRequestDate}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Contact:</span>
                        <span className="meta-value">{complaint.spokeTo}</span>
                    </div>
                </div>

                <div className="quick-actions">
                    <button className="action-button" onClick={(e) => {
                        e.stopPropagation();
                        window.open(complaint.links.complaint, '_blank');
                    }}>
                        View Docs
                    </button>
                    <button className="action-button secondary" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/complaint/${index}`);
                    }}>
                        Details
                    </button>
                </div>
            </div>

            <div className={`status-bubble ${getStatusColor()}`} onClick={handleStatusChange}>
                <span className="bubble"></span>
                {status}
            </div>
        </div>
    );
}

function ComplaintDetail({ complaints }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const complaint = complaints[id];

    if (!complaint) return <div>Complaint not found</div>;

    return (
        <div className="detail-page">
            <button onClick={() => navigate('/')} className="back-button">
                ← Back to Complaints
            </button>
            <div className="detail-container">
                <h1>Complaint {parseInt(id) + 1}</h1>
                <h2>{complaint.title}</h2>
                
                <div className="detail-content">
                    <div className="detail-section">
                        <h3>Description</h3>
                        <p>{complaint.description}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Links</h3>
                        <ul>
                            {Object.entries(complaint.links).map(([key, value]) => (
                                <li key={key}>
                                    <strong>{key}:</strong> <a href={value}>{value}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h3>Additional Information</h3>
                        <p><strong>Civilyzer:</strong> {complaint.civilyzer}</p>
                        <p><strong>Request Date:</strong> {complaint.requestDate}</p>
                        <p><strong>Next Request Date:</strong> {complaint.nextRequestDate}</p>
                        <p><strong>Who Called:</strong> {complaint.whoCalled}</p>
                        <p><strong>Spoke To:</strong> {complaint.spokeTo}</p>
                        <p><strong>When:</strong> {complaint.when}</p>
                        <p><strong>Result:</strong> {complaint.result}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

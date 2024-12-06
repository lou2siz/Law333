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
        setIsLoading(true);
        fetch(`${process.env.PUBLIC_URL}/LawsistViewMetadata.csv`)
            .then(response => response.text())
            .then(csvData => {
                Papa.parse(csvData, {
                    complete: (results) => {
                        // Transform the CSV data into complaint objects
                        const complaints = [];
                        const rows = results.data;
                        
                        // Process 6 complaints (they're in columns)
                        for (let i = 0; i < 6; i++) {
                            const complaint = {
                                title: rows[1][i * 2], // Each complaint takes 2 columns
                                links: {
                                    fullFolder: rows[3][i * 2 + 1],
                                    complaint: rows[4][i * 2 + 1],
                                    exhibit: rows[5][i * 2 + 1],
                                    trackChanges: rows[6][i * 2 + 1],
                                    sourceData: rows[7][i * 2 + 1],
                                    civilyzer: rows[8][i * 2 + 1] || ''
                                },
                                requestDate: rows[9][i * 2 + 1]?.replace(/"/g, '') || '',
                                nextRequestDate: rows[10][i * 2 + 1]?.replace(/"/g, '') || '',
                                whoCalled: rows[11][i * 2 + 1] || '',
                                spokeTo: rows[12][i * 2 + 1] || '',
                                when: rows[13][i * 2 + 1]?.replace(/"/g, '') || '',
                                result: rows[14][i * 2 + 1]?.replace(/"/g, '') || ''
                            };
                            complaints.push(complaint);
                        }
                        
                        setComplaints(complaints);
                        setIsLoading(false);
                    },
                    error: (error) => {
                        console.error('Error parsing CSV:', error);
                        setError('Failed to load case data. Please try again.');
                        setIsLoading(false);
                    }
                });
            })
            .catch(err => {
                console.error('Error loading CSV:', err);
                setError('Failed to load case data. Please try again.');
                setIsLoading(false);
            });
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

            <div className="news-dashboard">
                <div className="news-title">
                    <i className="fas fa-newspaper"></i>
                    Demand Dashboard News
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

function ComplaintCard({ complaint, index, viewMode }) {
    const navigate = useNavigate();
    const dueDate = new Date('2024-11-16');
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    const [status, setStatus] = useState('Pending Lawyer Review');
    const [isHovered, setIsHovered] = useState(false);
    
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
        
        if (status === 'Pending Lawyer Review') {
            setStatus('Lawyer Accepted');
        } 
        else if (status === 'Lawyer Accepted') {
            setStatus('Lawyer Rejected');
        }
        else if (status === 'Lawyer Rejected') {
            setStatus('Pending Lawyer Review');
        }
    };

    return (
        <div 
            className={`complaint-card ${viewMode} ${getStatusClass()} ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/complaint/${index}`)}
            style={{
                '--hover-offset': `${index * 5}px`,
                '--animation-delay': `${index * 0.1}s`
            }}
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

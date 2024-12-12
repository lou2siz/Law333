import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import DataView from './components/DataView';
import ComplaintDetail from './components/ComplaintDetail';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <Login onLogin={setIsAuthenticated} />;
    }

    return (
        <Router>
            <div className="app-container">
                <nav className="main-nav">
                    <Link to="/">Lawsist View</Link>
                    <Link to="/complaints">Complaints</Link>
                    <Link to="/demands">Demands</Link>
                </nav>

                <Routes>
                    <Route path="/" element={
                        <DataView 
                            csvFile="LawsistViewMetadata.csv" 
                            title="Lawsist View" 
                        />
                    } />
                    <Route path="/complaints" element={
                        <DataView 
                            csvFile="ComplaintViewMetadata.csv" 
                            title="Complaint View" 
                        />
                    } />
                    <Route path="/demands" element={
                        <DataView 
                            csvFile="DemandViewMetadata.csv" 
                            title="Demand View" 
                        />
                    } />
                    <Route path="/complaint/:id" element={<ComplaintDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

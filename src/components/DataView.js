import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import ComplaintGrid from './ComplaintGrid';

function DataView({ csvFile, title }) {
    const [isLoading, setIsLoading] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${process.env.PUBLIC_URL}/${csvFile}`)
            .then(response => response.text())
            .then(csvData => {
                Papa.parse(csvData, {
                    complete: (results) => {
                        const complaints = [];
                        const rows = results.data;
                        
                        // Process 6 complaints (they're in columns)
                        for (let i = 0; i < 6; i++) {
                            let complaint = {};
                            
                            // Handle different CSV structures based on the file
                            if (csvFile === 'ComplaintViewMetadata.csv') {
                                complaint = {
                                    title: rows[1][i * 2], // Subfolder Title
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
                                    result: rows[14][i * 2 + 1]?.replace(/"/g, '') || '',
                                    lawyerReview: rows[15][i * 2 + 1] || '' // Additional field for Complaint View
                                };
                            } else if (csvFile === 'DemandViewMetadata.csv') {
                                complaint = {
                                    title: rows[1][i * 2],
                                    links: {
                                        fullFolder: rows[3][i * 2 + 1],
                                        waiver: rows[4][i * 2 + 1],
                                        settlement: rows[5][i * 2 + 1],
                                        demand: rows[6][i * 2 + 1],
                                        sourceData: rows[7][i * 2 + 1],
                                        waiverTrack: rows[8][i * 2 + 1] || '',
                                        settlementTrack: rows[9][i * 2 + 1] || '',
                                        demandTrack: rows[10][i * 2 + 1] || ''
                                    },
                                    lawyer: rows[11][i * 2 + 1] || '',
                                    judge: rows[12][i * 2 + 1] || '',
                                    defendantEmail: rows[13][i * 2 + 1] || '',
                                    wName: rows[14][i * 2 + 1] || '',
                                    lawyerReview: rows[15][i * 2 + 1] || ''
                                };
                            } else {
                                // Default LawsistView structure
                                complaint = {
                                    title: rows[1][i * 2],
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
                            }
                            
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
    }, [csvFile]);

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
        <div className="view-container">
            <header className="app-header">
                <img src={`${process.env.PUBLIC_URL}/Logo.png`} alt="Logo" className="logo" />
                <h1>{title}</h1>
            </header>
            <ComplaintGrid complaints={complaints} />
        </div>
    );
}

export default DataView; 
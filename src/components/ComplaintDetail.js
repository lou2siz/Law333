import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ComplaintDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="detail-page">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>
            <div className="detail-container">
                <h1>Complaint Details</h1>
                <p>Complaint ID: {id}</p>
                {/* Add more detail fields as needed */}
            </div>
        </div>
    );
}

export default ComplaintDetail; 
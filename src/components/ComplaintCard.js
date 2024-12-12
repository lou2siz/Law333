import React from 'react';
import { useNavigate } from 'react-router-dom';

function ComplaintCard({ complaint, index, viewMode }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/complaint/${index}`);
    };

    return (
        <div 
            className={`complaint-card ${viewMode}`} 
            onClick={handleClick}
        >
            <div className="cyber-corner top-left"></div>
            <div className="cyber-corner top-right"></div>
            <div className="cyber-corner bottom-left"></div>
            <div className="cyber-corner bottom-right"></div>

            <h3 className="case-title">{complaint.title}</h3>
            
            <div className="meta-info">
                {complaint.requestDate && (
                    <div className="meta-item">
                        <span className="meta-label">Request Date:</span>
                        <span className="meta-value">{complaint.requestDate}</span>
                    </div>
                )}
                
                {complaint.nextRequestDate && (
                    <div className="meta-item">
                        <span className="meta-label">Next Request:</span>
                        <span className="meta-value">{complaint.nextRequestDate}</span>
                    </div>
                )}

                {complaint.whoCalled && (
                    <div className="meta-item">
                        <span className="meta-label">Who Called:</span>
                        <span className="meta-value">{complaint.whoCalled}</span>
                    </div>
                )}

                {complaint.spokeTo && (
                    <div className="meta-item">
                        <span className="meta-label">Spoke To:</span>
                        <span className="meta-value">{complaint.spokeTo}</span>
                    </div>
                )}

                {complaint.result && (
                    <div className="meta-item">
                        <span className="meta-label">Result:</span>
                        <span className="meta-value">{complaint.result}</span>
                    </div>
                )}
            </div>

            <div className="quick-actions">
                {Object.entries(complaint.links).map(([key, value]) => (
                    value && (
                        <a 
                            key={key}
                            href={value}
                            className="action-button"
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </a>
                    )
                ))}
            </div>
        </div>
    );
}

export default ComplaintCard; 
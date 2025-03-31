import React from 'react';
import "../Assets/ShowInfo.css"

const ShowInfo = ({ labels, data }) => {
  return (
    <div className="info-display">
      {labels.map((label, index) => (
        <div key={index} className="info-item">
          <strong>{label}:</strong>
          <span>{data[label] || 'N/A'}</span>
        </div>
      ))}
    </div>
  );
};

export default ShowInfo;
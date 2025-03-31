import React from 'react';
import '../Assets/FeedbackPopup.css';

const FeedbackPopup = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`feedback-popup ${type}`}>
      <div className="feedback-message">{message}</div>
      <button className="close-button" onClick={onClose}>✖</button>
    </div>
  );
};

export default FeedbackPopup;
import React, { useEffect, useRef } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  const timerRef = useRef(null);

  // Clear any existing timer when message changes
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [message, onClose]);

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onClose();
  };

  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose}>&times;</button>
    </div>
  );
};

export default Toast;

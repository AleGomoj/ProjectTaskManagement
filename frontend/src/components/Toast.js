import React, { useEffect } from 'react';
import '../App.css';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`toast toast-${type}`}>{message}</div>
  );
};

export default Toast;

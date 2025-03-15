import React from 'react';
import './TransitionPanel.css'; // Import the CSS file


const TransitionPanel = ({ children }) => {
  return (
    <div className="transition-panel">
      {children}
    </div>
  );
};

export default TransitionPanel;
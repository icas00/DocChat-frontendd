import React from 'react';

const AdminControls = ({ onClearData, onResetSession }) => {
    return (
        <div className="admin-controls"
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
        >
            <button
                onClick={onClearData}
                className="admin-btn-clear"
            >
                Clear Data
            </button>
            <button
                onClick={onResetSession}
                className="admin-btn-reset"
            >
                Reset Session
            </button>
        </div>
    );
};

export default AdminControls;

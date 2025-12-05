import React from 'react';

const StepIndicator = ({ activeStep }) => {
    return (
        <div className="step-indicator">
            {[0, 1, 2, 3].map((step) => (
                <div key={step} style={{
                    width: '8px',
                    height: activeStep === step ? '40px' : '8px',
                    background: activeStep === step ? 'var(--accent)' : 'var(--line)',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                }} />
            ))}
        </div>
    );
};

export default StepIndicator;

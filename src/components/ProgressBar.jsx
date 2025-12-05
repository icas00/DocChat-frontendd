import React from 'react';

const ProgressBar = ({ activeStep }) => {
    // Map activeStep (0-3) to 3 visible segments for the pill
    // Hero (0) -> Segment 1 active
    // Step 1 (1) -> Segment 1 active (or 2? User said "3-step indicator")
    // Let's assume: 
    // Segment 1: Hero & Step 1
    // Segment 2: Step 2
    // Segment 3: Step 3
    // Or maybe just 3 steps total? The user prompt says "3-step indicator".
    // But we have Hero + 3 Steps = 4 states.
    // Let's map: 0->1, 1->1, 2->2, 3->3.

    const getActiveSegments = () => {
        if (activeStep <= 1) return 1;
        if (activeStep === 2) return 2;
        return 3;
    };

    const activeCount = getActiveSegments();

    return (
        <div style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            zIndex: 100,
            display: 'flex',
            gap: '8px',
            background: '#fff',
            padding: '8px',
            borderRadius: '50px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
            {[1, 2, 3].map((step) => (
                <div
                    key={step}
                    style={{
                        width: '40px',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: step <= activeCount ? '#191919' : '#E0D8CF',
                        transition: 'background-color 0.3s ease'
                    }}
                />
            ))}
        </div>
    );
};

export default ProgressBar;

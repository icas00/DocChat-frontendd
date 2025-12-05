import React from 'react';

export const Button = ({ children, className = '', variant = 'default', ...props }) => {
    // Basic styling to prevent crash. TestClientPage passes tailwind classes so this should be fine.
    return (
        <button className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props}>
            {children}
        </button>
    );
};

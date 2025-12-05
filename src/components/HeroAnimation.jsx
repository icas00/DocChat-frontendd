import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useReducedMotion from '../hooks/useReducedMotion';

const HeroAnimation = () => {
    const containerRef = useRef(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (reducedMotion || !containerRef.current) return;

        const timeline = anime.timeline({
            loop: true,
            easing: 'easeInOutQuad'
        });

        // Step 1: Upload Highlight
        timeline.add({
            targets: '.step-1 .icon-circle',
            scale: [1, 1.1, 1],
            borderColor: ['#3b82f6', '#60a5fa', '#3b82f6'],
            duration: 1000,
        });

        // Step 2: Train Highlight
        timeline.add({
            targets: '.step-2 .icon-circle',
            scale: [1, 1.1, 1],
            borderColor: ['#a855f7', '#c084fc', '#a855f7'],
            duration: 1000,
            offset: '-=500' // Overlap slightly
        });

        // Step 3: Deploy Highlight
        timeline.add({
            targets: '.step-3 .icon-circle',
            scale: [1, 1.1, 1],
            borderColor: ['#22c55e', '#4ade80', '#22c55e'],
            duration: 1000,
            offset: '-=500'
        });

        // Pause before loop
        timeline.add({
            duration: 1500
        });

    }, [reducedMotion]);

    const steps = [
        { icon: '📄', label: 'Upload', class: 'step-1', color: '#3b82f6' },
        { icon: '⚡', label: 'Train', class: 'step-2', color: '#a855f7' },
        { icon: '🚀', label: 'Deploy', class: 'step-3', color: '#22c55e' }
    ];

    return (
        <div ref={containerRef} style={{
            position: 'relative',
            width: '450px',
            height: '150px',
            marginTop: '2rem',
            pointerEvents: 'none'
        }}>
            {/* Steps */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                zIndex: 1
            }}>
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className={`step-item ${step.class}`}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        <div className="icon-circle" style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '12px', // Rounded rect for more "pro" look
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${step.color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            transition: 'all 0.3s ease'
                        }}>
                            {step.icon}
                        </div>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)',
                            opacity: 0.9,
                            letterSpacing: '0.05em'
                        }}>
                            {step.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeroAnimation;

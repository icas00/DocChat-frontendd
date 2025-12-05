import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

const IntroOverlay = ({ onComplete }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const timeline = anime.timeline({
            easing: 'easeInOutQuad',
            complete: onComplete
        });

        // Phase 1: Eyes Blink Open
        timeline.add({
            targets: '.intro-eyes',
            scaleY: [0, 1],
            opacity: [0, 1],
            duration: 600,
            delay: 500
        });

        // Phase 2: Trace the Body (SVG Path Animation)
        timeline.add({
            targets: '.intro-trace',
            strokeDashoffset: [anime.setDashoffset, 0],
            opacity: [0, 1],
            duration: 2000,
            easing: 'easeInOutSine'
        });

        // Phase 3: Fill/Fade (Transition to real robot)
        // We'll handle the actual swap in the parent, but we can fade out the trace here
        timeline.add({
            targets: '.intro-container',
            opacity: 0,
            duration: 500,
            delay: 200
        });

    }, [onComplete]);

    return (
        <div className="intro-container" style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgb(37, 36, 35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
        }}>
            <div style={{ position: 'relative', width: '400px', height: '400px' }}>
                {/* Cyan Eyes */}
                <div className="intro-eyes" style={{
                    position: 'absolute',
                    top: '42%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    gap: '40px',
                    zIndex: 10,
                    opacity: 0
                }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#35f2f8',
                        boxShadow: '0 0 20px #35f2f8'
                    }} />
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#35f2f8',
                        boxShadow: '0 0 20px #35f2f8'
                    }} />
                </div>

                {/* Tracing SVG */}
                <svg
                    ref={svgRef}
                    viewBox="0 0 400 400"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                >
                    {/* Simplified Robot Outline Path */}
                    <path
                        className="intro-trace"
                        d="M120,200 C120,140 160,110 200,110 C240,110 280,140 280,200 L280,240 C280,280 250,310 200,310 C150,310 120,280 120,240 Z"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0"
                    />
                    {/* Antenna */}
                    <path
                        className="intro-trace"
                        d="M200,110 L200,70 M190,70 L210,70"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0"
                    />
                    {/* Arms */}
                    <path
                        className="intro-trace"
                        d="M120,220 C100,220 80,240 80,260 M280,220 C300,220 320,240 320,260"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0"
                    />
                </svg>
            </div>
        </div>
    );
};

export default IntroOverlay;

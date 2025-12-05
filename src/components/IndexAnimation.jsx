import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useReducedMotion from '../hooks/useReducedMotion';

const IndexAnimation = ({ active, isIndexing, robotRef, buttonRef, onComplete, wireColor = '#1a1a1a' }) => {
    const svgRef = useRef(null);
    const reducedMotion = useReducedMotion();
    const [positions, setPositions] = useState(null);

    useEffect(() => {
        if (!active || !buttonRef?.current || !robotRef?.current) return;

        // find where the button and robot are
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const robotRect = robotRef.current.getBoundingClientRect();

        const buttonPos = {
            x: buttonRect.left + buttonRect.width / 2,
            y: buttonRect.top + buttonRect.height / 2
        };

        const robotPos = {
            x: robotRect.left + robotRect.width / 2,
            y: robotRect.top + robotRect.height / 2
        };

        setPositions({ buttonPos, robotPos });
    }, [active, buttonRef, robotRef]);

    useEffect(() => {
        if (!active || reducedMotion || !positions) return;

        // animation when wires connect
        const timeline = anime.timeline({
            easing: 'easeInOutQuad'
        });

        // animate the 3 wires
        timeline.add({
            targets: '.index-line-1',
            strokeDashoffset: [anime.setDashoffset, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo'
        });

        // show the plug
        timeline.add({
            targets: '.connector-head',
            opacity: [0, 1],
            scale: [0.5, 1],
            duration: 200,
            easing: 'easeOutElastic(1, .8)'
        }, '-=100');

        // little spark effect
        timeline.add({
            targets: '.connection-spark',
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            duration: 300,
            easing: 'easeOutQuad'
        });

    }, [active, reducedMotion, positions]);

    // animation when wires go back
    useEffect(() => {
        if (!active || reducedMotion || !positions) return;

        if (!isIndexing) {
            anime({
                targets: '.index-line-1, .connector-head',
                opacity: 0,
                duration: 400,
                easing: 'easeOutQuad',
                complete: onComplete
            });
        }
    }, [isIndexing, active, reducedMotion, positions, onComplete]);

    if (!active || reducedMotion || !positions) return null;

    const { buttonPos, robotPos } = positions;

    return (
        <svg
            ref={svgRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 50
            }}
        >
            {/* wire from button to robot */}
            <path
                className="index-line-1"
                d={`M ${buttonPos.x} ${buttonPos.y + 33} Q ${(buttonPos.x + robotPos.x) / 10} ${(buttonPos.y + robotPos.y) / 2 + 250} ${robotPos.x - 25} ${robotPos.y + 100}`}
                fill="none"
                stroke={wireColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="2000"
                strokeDashoffset="2000"
                opacity="0"
            />


            {/* the plug part */}
            <rect
                className="connector-head"
                x={robotPos.x - 35}
                y={robotPos.y + 90}
                width="20"
                height="20"
                rx="4"
                fill="#333"
                stroke={wireColor}
                strokeWidth="2"
                opacity="0"
                transform={`rotate(-15, ${robotPos.x - 25}, ${robotPos.y + 100})`}
            />

            {/* the spark */}
            <circle
                className="connection-spark"
                cx={robotPos.x - 25}
                cy={robotPos.y + 100}
                r="15"
                fill="#60a5fa"
                opacity="0"
                style={{ filter: 'blur(4px)' }}
            />

            {/* glow effect */}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    );
};

export default IndexAnimation;

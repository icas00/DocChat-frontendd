import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useReducedMotion from '../hooks/useReducedMotion';

const HeroOrbs = () => {
    const orbsRef = useRef(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (!reducedMotion && orbsRef.current) {
            const timeline = anime.timeline({
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutSine'
            });

            timeline.add({
                targets: '.hero-orb',
                translateY: (el, i) => [anime.random(-10, 10), anime.random(-10, 10)],
                translateX: (el, i) => [anime.random(-8, 8), anime.random(-8, 8)],
                opacity: [10, 1],
                scale: [0.9, 1.1],
                duration: 3000,
                delay: anime.stagger(120, { from: 'center' })
            });

            return () => {
                timeline.pause();
            };
        }
    }, [reducedMotion]);

    // Generate random positions for orbs
    const orbs = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        top: `${anime.random(0, 220)}px`,
        left: `${anime.random(0, 260)}px`
    }));

    return (
        <div
            ref={orbsRef}
            style={{
                position: 'absolute',
                right: '120px',
                top: '40%',
                transform: 'translateY(-50%)',
                width: '260px',
                height: '220px',
                pointerEvents: 'none',
                zIndex: 1
            }}
        >
            {orbs.map((orb) => (
                <span
                    key={orb.id}
                    className="hero-orb"
                    style={{
                        position: 'absolute',
                        top: orb.top,
                        left: orb.left,
                        width: '10px',
                        height: '10px',
                        borderRadius: '999px',
                        background: 'rgba(0, 0, 0, 0.06)',
                        border: '1px solid #C2BAB3',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                />
            ))}
        </div>
    );
};

export default HeroOrbs;

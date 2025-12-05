import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useReducedMotion from '../hooks/useReducedMotion';

const ParticleEffect = ({ active, robotX, robotY }) => {
    const containerRef = useRef(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (!active || reducedMotion || !containerRef.current) return;

        const particles = [];
        const particleCount = 560; // original count – subtle effect

        // Get Step 1 section boundaries (where particles should spawn)
        const getStep1Bounds = () => {
            // Assuming Step 1 is the second <section> element in the page
            const sections = document.querySelectorAll('section');
            if (sections.length < 2) {
                // Fallback to full viewport if not found
                return {
                    left: 0,
                    right: window.innerWidth,
                    top: 0,
                    bottom: window.innerHeight
                };
            }
            const step1 = sections[1]; // second section is Step 1
            const rect = step1.getBoundingClientRect();
            return {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom
            };
        };

        const bounds = getStep1Bounds();

        // Create particles spawning randomly across Step 1 section
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random position within Step 1 bounds
            const startX = bounds.left + Math.random() * (bounds.right - bounds.left);
            const startY = bounds.top + Math.random() * (bounds.bottom - bounds.top);

            // Light‑blue color (hardly visible)
            const color = '#60a5fa';

            particle.style.position = 'absolute';
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            particle.style.width = '8px';   // small particles
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.background = color;
            particle.style.boxShadow = `0 0 8px ${color}`; // faint glow
            particle.style.opacity = '0';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '999';

            containerRef.current.appendChild(particle);
            particles.push({ element: particle, startX, startY });
        }

        // Animate particles flowing into the robot
        particles.forEach((p, idx) => {
            anime({
                targets: p.element,
                left: `${robotX}vw`,
                top: `${robotY}vh`,
                opacity: [
                    { value: 0.8, duration: 300, delay: idx * 100 },
                    { value: 0, duration: 300, delay: 1500 }
                ],
                scale: [
                    { value: 1, duration: 300 },
                    { value: 0.2, duration: 1500 }
                ],
                duration: 2000,
                delay: idx * 100,
                easing: 'easeInQuad',
                loop: true,
                loopDelay: 500
            });
        });

        return () => {
            particles.forEach(p => p.element.remove());
        };
    }, [active, reducedMotion, robotX, robotY]);

    if (!active || reducedMotion) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 4
            }}
        />
    );
};

export default ParticleEffect;

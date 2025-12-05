import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { Link } from 'react-router-dom';

const Header = () => {
    const textRef = useRef(null);

    useEffect(() => {
        const textWrapper = textRef.current;
        if (!textWrapper) return;

        // Wrap every letter in a span
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter' style='display:inline-block;'>$&</span>");

        anime({
            targets: '.letter',
            translateY: [
                { value: ['100%', '0%'], duration: 750, easing: 'easeOutCubic' },
                { value: '-100%', duration: 750, easing: 'easeInCubic', delay: 750 }
            ],
            delay: anime.stagger(50),
            loop: true
        });
    }, []);

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            padding: '1.5rem 3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            background: 'rgb(218, 213, 208)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--line)'
        }}>
            <div style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                letterSpacing: '-0.01em',
                color: 'var(--text)',
                overflow: 'hidden', // Clip the text
                height: '1.2em', // Limit height to one line
                display: 'flex',
                alignItems: 'center'
            }}>
                <span ref={textRef} style={{ display: 'inline-block', lineHeight: '1em' }}>
                    BotForge Engine
                </span>
            </div>

            <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                <Link to="/admin" style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-dim)',
                    transition: 'color 0.2s',
                    fontWeight: '400',
                    textDecoration: 'none'
                }}>
                    Dashboard
                </Link>
                {['Documentation'].map((item) => (
                    <a key={item} href="#" style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-dim)',
                        transition: 'color 0.2s',
                        fontWeight: '400',
                        textDecoration: 'none'
                    }}>
                        {item}
                    </a>
                ))}
                <button style={{
                    padding: '0.5rem 1.25rem',
                    background: 'var(--accent)',
                    color: 'var(--bg)',
                    borderRadius: '4px',
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    transition: 'opacity 0.2s',
                }}>
                    Get Started
                </button>
            </nav>
        </header>
    );
};

export default Header;

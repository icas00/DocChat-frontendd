import React from 'react';
import anime from 'animejs/lib/anime.es.js';
import { api } from '../../utils/api';

const EmbedSection = ({
    sectionRef,
    session,
    handleCopyEmbed,
    robotRef
}) => {
    return (
        <section
            ref={sectionRef}
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '0 3rem',
                position: 'relative',
                borderTop: '2px solid rgba(58, 57, 56, 0.25)'
            }}
        >
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start'
            }}>
                <div className="step-content" style={{
                    maxWidth: '550px',
                    marginRight: '150px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            lineHeight: 1
                        }}></div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: 'var(--text-dim)',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase'
                        }}>
                            Step 3
                        </div>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '600',
                        lineHeight: 1.2,
                        marginBottom: '2rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Embed on Your Site
                    </h2>
                    <p style={{
                        fontSize: '1.35rem',
                        color: 'var(--text-dim)',
                        marginBottom: '2.5rem',
                        lineHeight: 1.7
                    }}>
                        Add the chat widget to any website with a single script tag.
                    </p>

                    <div className="interactive-box" style={{
                        background: 'rgba(58, 57, 56, 0.04)',
                        padding: '2.5rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(58, 57, 56, 0.08)',
                        boxShadow: '0 4px 20px rgba(58, 57, 56, 0.08)',
                        marginTop: '2rem',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}>
                        <div style={{
                            padding: '2rem',
                            background: 'rgba(58, 57, 56, 0.08)',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '1.05rem',
                            color: 'var(--text)',
                            marginBottom: '2rem',
                            wordBreak: 'break-all',
                            lineHeight: 1.8
                        }}>
                            {`<script src="${api.BASE_URL}/widget.js" data-api-key="${session?.apiKey || 'YOUR_API_KEY'}"></script>`}
                        </div>
                        <button
                            onClick={handleCopyEmbed}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                background: 'var(--accent)',
                                color: 'var(--bg)',
                                borderRadius: '4px',
                                fontSize: '1.2rem',
                                fontWeight: '500'
                            }}
                        >
                            Copy Embed Code
                        </button>
                        <button
                            className="preview-btn" // class for targeting
                            onClick={(e) => {
                                // animation logic
                                const btn = e.currentTarget;
                                const btnRect = btn.getBoundingClientRect();
                                const robot = robotRef.current;
                                const robotRect = robot.getBoundingClientRect();

                                // find center of button
                                const targetX = btnRect.left + btnRect.width / 2;
                                const targetY = btnRect.top + btnRect.height / 2;

                                // find center of robot
                                const startX = robotRect.left + robotRect.width / 2;
                                const startY = robotRect.top + robotRect.height / 2;

                                // find difference
                                const deltaX = targetX - startX;
                                const deltaY = targetY - startY;

                                // animate
                                anime({
                                    targets: robot,
                                    translateX: [0, deltaX],
                                    translateY: [0, deltaY],
                                    scale: [1, 0],
                                    opacity: [1, 0],
                                    rotate: '1turn', // spin it
                                    easing: 'easeInOutExpo',
                                    duration: 1000,
                                    complete: () => {
                                        window.open(`/test-client?clientId=${session?.apiKey || ''}`, '_blank');
                                        // reset later
                                        setTimeout(() => {
                                            anime.set(robot, { translateX: 0, translateY: 0, scale: 1, opacity: 1, rotate: 0 });
                                        }, 1000);
                                    }
                                });
                            }}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                background: 'transparent',
                                color: 'var(--text)',
                                border: '2px solid var(--text)',
                                borderRadius: '4px',
                                fontSize: '1.2rem',
                                fontWeight: '500',
                                marginTop: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--text)';
                                e.currentTarget.style.color = 'var(--bg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text)';
                            }}
                        >
                            Open Preview
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmbedSection;

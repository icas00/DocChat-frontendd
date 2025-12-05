import React from 'react';

const IndexingSection = ({
    sectionRef,
    indexButtonRef,
    handleIndex,
    indexStatus
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
                background: 'rgb(37, 36, 35)', // dark background
                color: '#ffffff', // light text
                borderTop: 'none' // no border
            }}
        >
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <div className="step-content" style={{
                    maxWidth: '550px',
                    textAlign: 'right',
                    marginLeft: '150px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '2rem',
                        justifyContent: 'flex-end'
                    }}>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'rgba(255, 255, 255, 0.6)' // dim text
                        }}>
                            Step 2
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            lineHeight: 1
                        }}></div>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '600',
                        lineHeight: 1.2,
                        marginBottom: '2rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Index & Train
                    </h2>
                    <p style={{
                        fontSize: '1.35rem',
                        color: 'rgba(255, 255, 255, 0.7)', // dim text
                        marginBottom: '2.5rem',
                        lineHeight: 1.7
                    }}>
                        Trigger the indexing process to generate vector embeddings. This may take a few moments.
                    </p>

                    <div className="interactive-box" style={{
                        background: 'rgba(255, 255, 255, 0.05)', // see through bg
                        padding: '2.5rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)', // light border
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // shadow
                        textAlign: 'right',
                        marginTop: '2rem',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}>
                        <button
                            ref={indexButtonRef}
                            onClick={handleIndex}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                background: '#ffffff', // white button
                                color: 'rgb(37, 36, 35)', // dark text
                                borderRadius: '4px',
                                fontSize: '1.75rem',
                                fontWeight: '500',
                                marginBottom: indexStatus ? '1.5rem' : '0'
                            }}
                        >
                            Start Indexing
                        </button>
                        {indexStatus && (
                            <div style={{
                                fontSize: '1.1rem',
                                color: indexStatus.startsWith('✓') ? '#4ade80' : 'var(--text-dim)',
                                textAlign: 'right'
                            }}>
                                {indexStatus}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IndexingSection;

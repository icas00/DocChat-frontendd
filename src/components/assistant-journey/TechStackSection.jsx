import React from 'react';

const TechStackSection = () => {
    return (
        <section style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 3rem',
            background: 'rgba(58, 57, 56, 0.03)',
            borderTop: '1px solid var(--line)'
        }}>
            <div style={{
                maxWidth: '900px',
                textAlign: 'center',
                marginBottom: '4rem'
            }}>
                <h2 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    letterSpacing: '-0.02em'
                }}>
                    Built with Modern Tech
                </h2>
                <p style={{
                    fontSize: '1.4rem',
                    color: 'var(--text-dim)',
                    lineHeight: 1.7,
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                    A full-stack demonstration of scalable AI architecture, combining a responsive React frontend with a robust Spring Boot backend.
                </p>
            </div>

            // grid for tech stack
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                width: '100%',
                maxWidth: '1000px'
            }}>
                {[
                    { title: "Frontend", desc: "React, Vite, Anime.js", icon: "⚛️" },
                    { title: "Backend", desc: "Spring Boot, Java 17", icon: "🍃" },
                    { title: "AI Engine", desc: "RAG, Vector Search", icon: "🧠" },

                ].map((tech, idx) => (
                    <div key={idx} style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '2rem',
                        textAlign: 'center',
                        transition: 'transform 0.3s ease',
                        cursor: 'default'
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{tech.icon}</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>{tech.title}</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>{tech.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TechStackSection;

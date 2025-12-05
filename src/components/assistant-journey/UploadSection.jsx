import React from 'react';

const UploadSection = ({
    sectionRef,
    fileInputRef,
    handleFileSelect,
    handleFileUpload,
    selectedFile,
    uploadStatus
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
                            Step 1
                        </div>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '600',
                        lineHeight: 1.2,
                        marginBottom: '2rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Upload Your Knowledge Base
                    </h2>
                    <p style={{
                        fontSize: '1.35rem',
                        color: 'var(--text-dim)',
                        marginBottom: '2.5rem',
                        lineHeight: 1.7
                    }}>
                        Upload PDFs or text files. Your assistant will automatically process and learn from your documents.
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
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.txt"
                            onChange={handleFileSelect}
                            style={{
                                width: '100%',
                                marginBottom: '1.5rem',
                                fontSize: '1.1rem',
                                padding: '0.5rem'
                            }}
                        />
                        <button
                            onClick={handleFileUpload}
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
                            Upload Document
                        </button>
                        {uploadStatus && (
                            <div style={{
                                marginTop: '1.5rem',
                                fontSize: '1.1rem',
                                color: uploadStatus.startsWith('✓') ? 'green' : 'var(--text-dim)'
                            }}>
                                {uploadStatus}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UploadSection;

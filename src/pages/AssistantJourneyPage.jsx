import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import '../styles/AssistantJourney.css';
import Header from '../components/Header';
import RobotAnimation from '../components/RobotAnimation';
import HeroAnimation from '../components/HeroAnimation';
import ParticleEffect from '../components/ParticleEffect';
import IndexAnimation from '../components/IndexAnimation';
import IntroOverlay from '../components/IntroOverlay';
import anime from 'animejs/lib/anime.es.js';
import useReducedMotion from '../hooks/useReducedMotion';
import { api } from '../utils/api';
import { useSession } from '../hooks/useSession';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import robot1 from '../animations/robot-placeholder.json';
import robot2 from '../animations/Robot2.json';
import robot3 from '../animations/Robot3.json';

// new components we made
import AdminControls from '../components/assistant-journey/AdminControls';
import StepIndicator from '../components/assistant-journey/StepIndicator';
import UploadSection from '../components/assistant-journey/UploadSection';
import IndexingSection from '../components/assistant-journey/IndexingSection';
import EmbedSection from '../components/assistant-journey/EmbedSection';
import TechStackSection from '../components/assistant-journey/TechStackSection';

const ROBOT_OPTIONS = [robot1, robot2, robot3];

const AssistantJourneyPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [indexStatus, setIndexStatus] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentRobotIndex, setCurrentRobotIndex] = useState(0);

    // vars for the intro animation
    const [introComplete, setIntroComplete] = useState(false);
    const [showRealRobot, setShowRealRobot] = useState(false);

    // handling the session stuff
    const { session, loading: sessionLoading, error: sessionError, clearSession } = useSession();

    const reducedMotion = useReducedMotion();
    const sectionRefs = useRef([]);
    const fileInputRef = useRef(null);
    const robotRef = useRef(null);
    const robotInnerRef = useRef(null);
    const indexButtonRef = useRef(null);

    // physics stuff for smooth movement
    const targetPos = useRef({ x: 20, y: 50 });
    const currentPos = useRef({ x: 20, y: 50 });

    // Animation states
    const [showParticles, setShowParticles] = useState(false);
    const [showIndexAnimation, setShowIndexAnimation] = useState(false);
    const [isHustling, setIsHustling] = useState(false);

    // where the robot sits on each step
    const robotPositions = [
        { x: 20, y: 50 },   // Hero: center
        { x: 75, y: 50 },   // Step 1: upper-right (circling right content)
        { x: 20, y: 60 },   // Step 2: upper-left (circling left content)
        { x: 75, y: 60 },   // Step 3: upper-right (circling right content)
        { x: 85, y: 80 }    // Final: center-bottom
    ];

    // make sure we start at the top
    useEffect(() => {
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
    }, []);

    // checking if session works
    useEffect(() => {
        if (session) {
            console.log('✅ Session loaded:');
        } else if (sessionError) {
            console.error('❌ Session error:', sessionError);
        } else if (!sessionLoading) {
            console.warn('⚠️ No session available');
        }
    }, [session, sessionError, sessionLoading]);

    // math for smooth animations
    const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const quadraticBezier = (t, p0, p1, p2) => {
        const oneMinusT = 1 - t;
        return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2;
    };

    const handleScroll = useCallback(() => {
        if (!introComplete) return;

        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const totalSections = robotPositions.length - 1;
        const scrollPerSection = scrollHeight / totalSections;

        // figure out which section we are in
        const currentSection = Math.min(Math.floor(scrolled / scrollPerSection), totalSections - 1);
        const nextSection = currentSection + 1;

        // Progress within current section (0 to 1)
        const sectionProgress = (scrolled - (currentSection * scrollPerSection)) / scrollPerSection;

        // Get start and end positions
        const start = robotPositions[currentSection];
        const end = robotPositions[nextSection];

        // calculate where the robot should be
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const curveOffset = start.x < end.x ? -10 : 10;

        let x, y;
        if (sectionProgress < 0.5) {
            const t = sectionProgress * 2;
            x = quadraticBezier(t, start.x, midX + curveOffset, midX);
            y = quadraticBezier(t, start.y, midY - 5, midY);
        } else {
            const t = (sectionProgress - 0.5) * 2;
            x = quadraticBezier(t, midX, midX + curveOffset, end.x);
            y = quadraticBezier(t, midY, midY - 5, end.y);
        }

        if (reducedMotion) {
            if (robotRef.current) {
                robotRef.current.style.left = `${x}vw`;
                robotRef.current.style.top = `${y}vh`;
            }
        } else {
            // Update target position for physics loop
            targetPos.current = { x, y };
        }
    }, [introComplete, reducedMotion, robotPositions]);

    // loop to make movement smooth
    useEffect(() => {
        if (!introComplete || reducedMotion) return;

        let animationFrameId;

        const loop = () => {
            // Lerp factor (0.08 = smooth but responsive)
            const factor = 0.08;

            const lerp = (start, end, f) => start + (end - start) * f;

            currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, factor);
            currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, factor);

            if (robotRef.current) {
                // Use translate3d for GPU acceleration
                // Include translate(-50%, -50%) to maintain centering
                robotRef.current.style.transform = `translate3d(${currentPos.current.x}vw, ${currentPos.current.y}vh, 0) translate(-50%, -50%)`;

                // Ensure left/top are reset so transform takes over
                robotRef.current.style.left = '0';
                robotRef.current.style.top = '0';
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        loop();

        return () => cancelAnimationFrame(animationFrameId);
    }, [introComplete, reducedMotion]);

    // listen for scrolling
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // fix position when things change
    useLayoutEffect(() => {
        if (introComplete) handleScroll();
    });


    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = sectionRefs.current.indexOf(entry.target);
                    if (index !== -1) {
                        setActiveStep(index);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            if (observer) observer.disconnect();
        };
    }, []);



    useEffect(() => {
        if (!reducedMotion) {
            anime({
                targets: '.step-content',
                translateX: [100, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutExpo'
            });
        }
    }, [activeStep, reducedMotion]);

    const getState = (step) => {
        switch (step) {
            case 0: return 'hero';
            case 1: return 'knowledge';
            case 2: return 'personality';
            case 3: return 'deploy';
            default: return 'hero';
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        // Trigger particle effect when file is selected
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 5500);

        // robot shakes when file is picked
        if (robotInnerRef.current && !reducedMotion) {
            anime({
                targets: robotInnerRef.current,
                translateX: [
                    { value: -12, duration: 100 },
                    { value: 12, duration: 100 },
                    { value: -12, duration: 100 },
                    { value: 12, duration: 100 },
                    { value: -8, duration: 100 },
                    { value: 8, duration: 100 },
                    { value: 0, duration: 150 }
                ],
                easing: 'easeInOutQuad'
            });
        }

        setUploadStatus('File selected! Click "Upload Document" to proceed.');
    };

    const handleFileUpload = async () => {
        if (!selectedFile || !session) {
            if (!session) setUploadStatus('Session initializing...');
            else if (!selectedFile) setUploadStatus('Please select a file first.');
            return;
        }

        // check if we have the keys
        if (!session.clientId || !session.adminKey) {
            console.error('Session missing required fields:');
            setUploadStatus('✗ Session error: Missing authentication data. Try "Reset Session".');
            return;
        }

        console.log('Uploading with session');
        setUploadStatus('Uploading...');

        try {
            await api.uploadDocument(session.clientId, selectedFile, session.adminKey);
            setUploadStatus('✓ Upload successful');
            if (fileInputRef.current) fileInputRef.current.value = '';
            setSelectedFile(null); // Clear selection after upload
        } catch (error) {
            console.error('Upload error:', error);

            // Provide more specific error messages
            if (error.message.includes('401')) {
                setUploadStatus('Authentication failed. Try "Reset Session" button.');
            } else if (error.message.includes('Failed to fetch')) {
                setUploadStatus('Cannot connect to server. Check backend status.');
            } else {
                setUploadStatus(`Error: ${error.message}`);
            }

            setShowParticles(false);
        }
    };

    const handleIndex = async () => {
        if (!session) return;
        setIndexStatus('Indexing...');
        setShowIndexAnimation(true);
        setIsHustling(true);

        // robot moves fast while working
        if (robotInnerRef.current && !reducedMotion) {
            anime({
                targets: robotInnerRef.current,
                translateX: [
                    { value: '-8px', duration: 300 },
                    { value: '8px', duration: 300 },
                    { value: '-8px', duration: 300 },
                    { value: '8px', duration: 300 },
                    { value: '0px', duration: 300 }
                ],
                loop: true, // Loop indefinitely until stopped
                easing: 'easeInOutQuad'
            });
        }

        try {
            await api.triggerIndexing(session.clientId, session.adminKey);

            // wait a bit so animation shows
            await new Promise(resolve => setTimeout(resolve, 3000));

            setIndexStatus('✓ Indexing Complete');
            setIsHustling(false);

            // stop the robot
            if (robotInnerRef.current) {
                anime.remove(robotInnerRef.current);
                robotInnerRef.current.style.transform = 'none';
            }

        } catch (error) {
            console.error(error);
            setIndexStatus(`✗ Error: ${error.message}`);
            setShowIndexAnimation(false);
            setIsHustling(false);
            if (robotInnerRef.current) {
                anime.remove(robotInnerRef.current);
                robotInnerRef.current.style.transform = 'none';
            }
        }
    };

    const handleCopyEmbed = () => {
        if (!session) return;
        const embedCode = `<script src="${api.BASE_URL}/widget.js" data-api-key="${session.apiKey}"></script>`;
        navigator.clipboard.writeText(embedCode);
        alert('Embed code copied to clipboard!');
    };

    const handleClearSystemData = async () => {
        const key = prompt("Enter Super Admin Key to clear ALL system data:");
        if (!key) return;
        try {
            await api.clearSystemData(key);
            alert("System data cleared successfully.");
            clearSession();
        } catch (error) {
            alert("Failed to clear data: " + error.message);
        }
    };

    const handleIntroComplete = () => {
        setShowRealRobot(true);

        // move robot to start position
        if (robotRef.current) {
            anime({
                targets: robotRef.current,
                left: ['50vw', '20vw'],
                top: ['50vh', '50vh'],
                duration: 1500,
                easing: 'easeInOutExpo',
                complete: () => {
                    setIntroComplete(true);
                }
            });
        }
    };

    return (
        <div className="assistant-journey-page">
            {/* Admin Controls */}
            {introComplete && (
                <AdminControls
                    onClearData={handleClearSystemData}
                    onResetSession={clearSession}
                />
            )}

            {!introComplete && <IntroOverlay onComplete={handleIntroComplete} />}

            <div className={`content-wrapper ${introComplete ? 'active' : ''}`}>
                <Header />

                {/* Particle Effect for Step 1 */}
                <ParticleEffect
                    active={showParticles}
                    robotX={robotPositions[1].x}
                    robotY={robotPositions[1].y}
                />

                {/* Index Animation for Step 2 */}
                <IndexAnimation
                    active={showIndexAnimation}
                    isIndexing={indexStatus === 'Indexing...'}
                    robotRef={robotRef}
                    buttonRef={indexButtonRef}
                    onComplete={() => setShowIndexAnimation(false)}
                    wireColor="#000000" // Black wire as requested
                />

                {/* Hero Section */}
                <section
                    ref={el => sectionRefs.current[0] = el}
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '120px 5% 0 5%', // Top padding for fixed header
                        position: 'relative',
                        background: 'rgb(37, 36, 35)', // Flat Dark Background
                        color: '#ffffff',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background Grid (Optional subtle texture) */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.3,
                        pointerEvents: 'none'
                    }} />

                    <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end', // Push content to the right
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <div className="step-content" style={{
                            maxWidth: '600px',
                            textAlign: 'left', // Align text left for readability
                            paddingLeft: '2rem'
                        }}>
                            <h1 style={{
                                fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
                                fontWeight: '800',
                                lineHeight: 1.1,
                                marginBottom: '1.5rem',
                                letterSpacing: '-0.04em',
                                background: 'linear-gradient(135deg, #ffffff 0%, #a5a5a5 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))'
                            }}>
                                Enterprise-Grade <br />
                                <span style={{
                                    color: '#cd4435', // Rusty Red
                                    textShadow: '0 0 20px rgba(205, 68, 53, 0.3)'
                                }}>RAG Platform</span>
                            </h1>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                marginBottom: '3rem',
                                maxWidth: '550px'
                            }}>
                                {[
                                    "Add an intelligent chat assistant to your website in minutes.",
                                    "Powered by your documents, trained on your knowledge base.",
                                    "A high-performance, embeddable chat widget powered by Vector Search and Spring Boot."
                                ].map((item, index) => (
                                    <li key={index} style={{
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        fontSize: '1.15rem',
                                        color: 'rgba(255, 255, 255, 0.85)',
                                        lineHeight: 1.5
                                    }}>
                                        <span style={{ color: '#cd4435', fontSize: '1.2rem', marginTop: '2px' }}>▹</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Integrated Hero Animation (Flow) */}
                            <div style={{ transform: 'scale(0.9)', transformOrigin: 'left center' }}>
                                <HeroAnimation />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 1: Upload Documents */}
                <UploadSection
                    sectionRef={el => sectionRefs.current[1] = el}
                    fileInputRef={fileInputRef}
                    handleFileSelect={handleFileSelect}
                    handleFileUpload={handleFileUpload}
                    selectedFile={selectedFile}
                    uploadStatus={uploadStatus}
                />

                {/* Step 2: Index & Train */}
                <IndexingSection
                    sectionRef={el => sectionRefs.current[2] = el}
                    indexButtonRef={indexButtonRef}
                    handleIndex={handleIndex}
                    indexStatus={indexStatus}
                />

                {/* Step 3: Embed Widget */}
                <EmbedSection
                    sectionRef={el => sectionRefs.current[3] = el}
                    session={session}
                    handleCopyEmbed={handleCopyEmbed}
                    robotRef={robotRef}
                />

                {/* Final CTA / Tech Stack Showcase */}
                <TechStackSection />
            </div>
            {/* Robot following scroll path */}
            <div
                ref={robotRef}
                className={`robot-container ${showRealRobot ? 'visible' : ''}`}
                style={{
                    left: introComplete ? undefined : '50vw',
                    top: introComplete ? undefined : '50vh'
                }}
            >
                <div ref={robotInnerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <RobotAnimation
                        key={currentRobotIndex} // Force re-mount when robot changes
                        state={getState(activeStep)}
                        animationData={ROBOT_OPTIONS[currentRobotIndex]}
                        eyeColor={
                            isHustling ? '#ef4444' : // Red when indexing
                                showParticles ? '#22c55e' : // Green when uploading
                                    activeStep === 3 ? '#60a5fa' : // Blue when embedding
                                        '#35f2f8' // Default Cyan
                        }
                        outlineColor={
                            (activeStep === 0 || activeStep === 2) ? 'rgb(218, 213, 208)' : null
                        }
                    />

                    {/* arrows to switch robots */}
                    {activeStep === 0 && introComplete && (
                        <>
                            {/* Left Arrow */}
                            <button
                                onClick={() => setCurrentRobotIndex(prev => (prev - 1 + ROBOT_OPTIONS.length) % ROBOT_OPTIONS.length)}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '-80px',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#ef4444', // Red color as requested
                                    transition: 'transform 0.2s',
                                    zIndex: 100,
                                    padding: '10px',
                                    pointerEvents: 'auto' // Enable clicks
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                            >
                                <ChevronLeft size={64} strokeWidth={3} />
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={() => setCurrentRobotIndex(prev => (prev + 1) % ROBOT_OPTIONS.length)}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '-80px',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#ef4444', // Red color as requested
                                    transition: 'transform 0.2s',
                                    zIndex: 100,
                                    padding: '10px',
                                    pointerEvents: 'auto' // Enable clicks
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                            >
                                <ChevronRight size={64} strokeWidth={3} />
                            </button>

                            {/* dots at the bottom */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-40px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: '8px'
                            }}>
                                {ROBOT_OPTIONS.map((_, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: idx === currentRobotIndex ? '#ef4444' : 'rgba(255,255,255,0.3)',
                                            transition: 'background 0.3s'
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* blue glow for step 3 */}
                    {activeStep === 3 && <div className="robot-glow-pulse" />}

                    <div className="robot-glow" />
                </div>
            </div>

            {/* Step Indicator */}
            <StepIndicator activeStep={activeStep} />
        </div >
    );
};

export default AssistantJourneyPage;

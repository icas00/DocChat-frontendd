import React, { useEffect, useRef, useState } from 'react';
import RobotAnimation from './RobotAnimation';
import anime from 'animejs/lib/anime.es.js';
import useReducedMotion from '../hooks/useReducedMotion';

const RobotStage = ({ activeStep = 0, selectedPersonality, setSelectedPersonality, optionRefs, step3Refs }) => {
  const containerRef = useRef(null);
  const plugRef = useRef(null);
  const cableRef = useRef(null);

  // Drag state for Step 2
  const [isDragging, setIsDragging] = useState(false);
  const [plugPos, setPlugPos] = useState({ x: 0, y: 0 }); // Relative to container center
  const [cablePath, setCablePath] = useState('');

  // Reduced Motion Check
  const reducedMotion = useReducedMotion();

  // Map activeStep to state string for Lottie
  const getState = (step) => {
    switch (step) {
      case 0: return 'hero';
      case 1: return 'knowledge';
      case 2: return 'personality';
      case 3: return 'deploy';
      default: return 'hero';
    }
  };

  const currentState = getState(activeStep);

  // Aura Color Mapping
  const getAuraColor = (personality) => {
    switch (personality) {
      case 'playful': return 'var(--color-playful)';
      case 'balanced': return 'var(--color-balanced)';
      case 'formal': return 'var(--color-formal)';
      default: return 'transparent';
    }
  };

  const auraColor = getAuraColor(selectedPersonality);

  // --- Step 1: Knowledge Cables ---
  useEffect(() => {
    if (activeStep === 1) {
      anime({
        targets: '.step1-cable',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1000,
        delay: anime.stagger(100),
        opacity: [0, 1]
      });
      anime({
        targets: '.step1-label',
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(100, { start: 500 }),
        easing: 'easeOutQuad'
      });
    } else {
      anime.set('.step1-cable', { opacity: 0 });
      anime.set('.step1-label', { opacity: 0 });
    }
  }, [activeStep]);

  // --- Step 2: Personality Drag Logic ---

  // Initialize plug position when entering Step 2
  useEffect(() => {
    if (activeStep === 2) {
      // Start floating near robot
      setPlugPos({ x: 150, y: 50 });
    } else {
      setPlugPos({ x: 0, y: 0 }); // Reset
      setSelectedPersonality(null);
    }
  }, [activeStep, setSelectedPersonality]);

  // Calculate Cable Path
  useEffect(() => {
    if (activeStep === 2) {
      const startX = 0; // Robot center
      const startY = 0;

      // Control points for a "loose" cable look
      const cp1X = startX + (plugPos.x - startX) * 0.2;
      const cp1Y = startY + 100; // Dip down
      const cp2X = plugPos.x - (plugPos.x - startX) * 0.2;
      const cp2Y = plugPos.y + 100; // Dip down

      const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${plugPos.x} ${plugPos.y}`;
      setCablePath(path);
    }
  }, [plugPos, activeStep]);

  const handlePointerDown = (e) => {
    if (activeStep !== 2) return;
    e.preventDefault();
    setIsDragging(true);
    setSelectedPersonality(null);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPlugPos({ x, y });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap Logic
    if (optionRefs) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const checkSnap = (key, ref) => {
        if (!ref.current) return false;
        const targetRect = ref.current.getBoundingClientRect();
        // Target anchor point relative to container center
        // We want to snap to the LEFT of the option text
        const targetX = (targetRect.left - centerX) - 30;
        const targetY = (targetRect.top + targetRect.height / 2) - centerY;

        const dist = Math.sqrt(Math.pow(plugPos.x - targetX, 2) + Math.pow(plugPos.y - targetY, 2));

        if (dist < 150) { // Generous snap radius
          const endPos = { x: targetX, y: targetY };

          if (reducedMotion) {
            setPlugPos(endPos);
          } else {
            anime({
              targets: plugPos,
              x: endPos.x,
              y: endPos.y,
              duration: 400,
              easing: 'easeOutElastic(1, .6)',
              update: () => setPlugPos({ x: plugPos.x, y: plugPos.y })
            });
          }
          setSelectedPersonality(key);
          return true;
        }
        return false;
      };

      if (checkSnap('playful', optionRefs.playful)) return;
      if (checkSnap('balanced', optionRefs.balanced)) return;
      if (checkSnap('formal', optionRefs.formal)) return;
    }

    // Float back if no snap
    const floatPos = { x: 150, y: 50 };
    if (reducedMotion) {
      setPlugPos(floatPos);
    } else {
      anime({
        targets: plugPos,
        x: floatPos.x,
        y: floatPos.y,
        duration: 600,
        easing: 'easeOutElastic(1, .8)',
        update: () => setPlugPos({ x: plugPos.x, y: plugPos.y })
      });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);


  // --- Step 3: Deploy Cables ---
  useEffect(() => {
    if (activeStep === 3) {
      anime({
        targets: '.step3-cable',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1200,
        delay: anime.stagger(200),
        opacity: [0, 1]
      });
    } else {
      anime.set('.step3-cable', { opacity: 0 });
    }
  }, [activeStep]);


  return (
    <div
      ref={containerRef}
      style={{
        width: '400px',
        height: '400px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: activeStep === 2 ? 'auto' : 'none' // Allow interaction only in Step 2
      }}
    >
      {/* Aura */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${auraColor} 0%, transparent 70%)`,
        opacity: selectedPersonality ? 0.3 : 0,
        transition: 'all 0.5s ease',
        zIndex: 0
      }} />

      {/* Robot Lottie */}
      <div style={{
        width: activeStep === 0 ? '450px' : '320px', // Larger in Hero (~20% increase)
        height: activeStep === 0 ? '450px' : '320px',
        transition: 'all 0.5s ease',
        zIndex: 5,
        position: 'relative'
      }}>
        <RobotAnimation state={currentState} />
      </div>

      {/* Hero Cables Removed as per request */}
      <svg style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: activeStep === 0 ? 1 : 0,
        transition: 'opacity 0.5s ease',
        overflow: 'visible'
      }}>
        {/* No cables */}
      </svg>

      {/* Step 1: Knowledge Cables & Labels */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        display: activeStep === 1 ? 'block' : 'none'
      }}>
        {/* Top Right Keywords */}
        <div className="step1-label" style={{ position: 'absolute', top: '20px', right: '-120px', textAlign: 'left' }}>Reads docs</div>
        <div className="step1-label" style={{ position: 'absolute', top: '60px', right: '-140px', textAlign: 'left' }}>Context aware</div>
        <div className="step1-label" style={{ position: 'absolute', top: '100px', right: '-120px', textAlign: 'left' }}>Key concepts</div>

        {/* Bottom Left Keywords */}
        <div className="step1-label" style={{ position: 'absolute', bottom: '100px', left: '-120px', textAlign: 'right' }}>Splits data</div>
        <div className="step1-label" style={{ position: 'absolute', bottom: '60px', left: '-140px', textAlign: 'right' }}>Builds memory</div>
        <div className="step1-label" style={{ position: 'absolute', bottom: '20px', left: '-120px', textAlign: 'right' }}>Ready</div>

        <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Top Right Cables */}
          <path className="step1-cable" d="M 200 20 C 150 20, 100 50, 50 100" fill="none" stroke="var(--line-color)" strokeWidth="3" />
          <path className="step1-cable" d="M 220 60 C 170 60, 120 80, 60 110" fill="none" stroke="var(--line-color)" strokeWidth="3" />
          <path className="step1-cable" d="M 200 100 C 150 100, 100 110, 50 120" fill="none" stroke="var(--line-color)" strokeWidth="3" />

          {/* Bottom Left Cables */}
          <path className="step1-cable" d="M -200 300 C -150 300, -100 280, -50 250" fill="none" stroke="var(--line-color)" strokeWidth="3" />
          <path className="step1-cable" d="M -220 340 C -170 340, -120 300, -60 260" fill="none" stroke="var(--line-color)" strokeWidth="3" />
          <path className="step1-cable" d="M -200 380 C -150 380, -100 320, -50 270" fill="none" stroke="var(--line-color)" strokeWidth="3" />
        </svg>
      </div>

      {/* Step 2: Draggable Cable */}
      {activeStep === 2 && (
        <>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible', zIndex: 20, pointerEvents: 'none' }}>
            <path d={cablePath} fill="none" stroke="#191919" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <div
            ref={plugRef}
            onPointerDown={handlePointerDown}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: `translate(${plugPos.x}px, ${plugPos.y}px) translate(-50%, -50%)`,
              width: '32px', height: '20px',
              background: '#191919',
              borderRadius: '4px',
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 30,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ width: '6px', height: '100%', background: '#fff', position: 'absolute', left: '4px', top: 0, opacity: 0.3 }}></div>
          </div>
        </>
      )}

      {/* Step 3: Deploy Cables */}
      {activeStep === 3 && (
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible', zIndex: 10, pointerEvents: 'none' }}>
          {/* Cable to Script (Left) */}
          <path className="step3-cable" d="M -300 250 C -200 250, -100 200, -20 150" fill="none" stroke="var(--line-color)" strokeWidth="4" />
          {/* Cable to Preview (Left Lower) */}
          <path className="step3-cable" d="M -300 350 C -200 350, -100 300, -20 180" fill="none" stroke="var(--line-color)" strokeWidth="4" />
        </svg>
      )}

    </div>
  );
};

export default RobotStage;

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronDown, Globe } from 'lucide-react';

const IntroScreen = ({ onComplete, is24Hour = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userTimeZone, setUserTimeZone] = useState('');

  const containerRef = useRef(null);
  const bgImageRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimeZone(zone.replace('_', ' ').split('/').pop());
    } catch (e) {
      setUserTimeZone('Local Time');
    }
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(bgImageRef.current, {
      scale: 1.4,
      opacity: 0,
      duration: 1.8,
      ease: "power3.out"
    })
      .from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, "-=1.2")
      .from(detailsRef.current.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.5");

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 2;
      const yPos = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to(bgImageRef.current, {
        x: xPos * 20,
        y: yPos * 20,
        duration: 1,
        ease: "power2.out"
      });

      gsap.to(contentRef.current, {
        x: xPos * -10,
        y: yPos * -10,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);

  }, { scope: containerRef });

  const handleExit = () => {
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: onComplete
    });
  };

  const handleWheel = (e) => {
    if (e.deltaY > 50) handleExit();
  };

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !is24Hour
  });

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onClick={handleExit}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#050505',
        zIndex: 9999,
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '-10%', left: '-10%', right: '-10%', bottom: '-10%',
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          ref={bgImageRef}
          src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop"
          alt="Atmospheric Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.4) contrast(1.1) blur(2px)',
            transform: 'scale(1.1)'
          }}
        />
      </div>

      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '2rem'
        }}
      >
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <span style={{
              background: '#8b5cf6',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Welcome
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            fontWeight: 900,
            margin: 0,
            letterSpacing: '-2px',
            lineHeight: 0.9,
            background: 'linear-gradient(to bottom right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ATARAXIA
          </h1>

          <h2 style={{
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            fontWeight: 900,
            margin: 0,
            letterSpacing: '-2px',
            lineHeight: 0.9,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.4)'
          }}>
            TIMER
          </h2>
        </div>

        <div ref={detailsRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            padding: '10px 25px',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Globe size={16} color="#a1a1aa" />
            <span style={{ fontSize: '1rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {formattedTime}
            </span>
            <div style={{ width: '1px', height: '16px', background: '#ffffff30' }} />
            <span style={{ color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {userTimeZone}
            </span>
          </div>

          <div style={{
            opacity: 0.6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            marginTop: '3vh'
          }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Scroll or Click to Begin
            </span>
            <ChevronDown size={24} className="animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
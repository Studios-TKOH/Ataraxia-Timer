import React, { useState, useEffect } from 'react';
import { Clock, Download } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt'; 

const Header = ({ is24Hour }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { showInstallBtn, installApp } = useInstallPrompt();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !is24Hour
  });

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.5rem 0', 
      width: '100%', 
      maxWidth: '1200px' 
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Ataraxia</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {showInstallBtn && (
          <button 
            onClick={installApp}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(109, 40, 217, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Download size={14} />
            Install App
          </button>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.05)',
          padding: '8px 12px',
          borderRadius: '20px',
          border: '1px solid var(--glass-border)'
        }}>
          <Clock size={14} color="var(--text-muted)" />
          <span style={{ 
            fontSize: '0.9rem', 
            fontWeight: 600, 
            fontVariantNumeric: 'tabular-nums', 
            minWidth: '65px', 
            textAlign: 'center' 
          }}>
            {formattedTime}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
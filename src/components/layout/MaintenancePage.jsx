import React, { useEffect, useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';

const MaintenancePage = () => {
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        return () => {
            document.documentElement.style.overflow = 'unset';
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050505',
            color: 'white',
            textAlign: 'center',
            padding: '20px',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            overflow: 'hidden'
        }}>
            <div className="maintenance-icon-container">
                <Settings size={64} className="animate-spin-slow" color="#8b5cf6" />
            </div>

            <h1 style={{ marginTop: '24px', fontSize: '2rem', fontWeight: '600' }}>
                Ataraxia is under maintenance
            </h1>

            <p style={{ color: '#9ca3af', marginTop: '12px', maxWidth: '400px', lineHeight: '1.6' }}>
                We're fine-tuning the gears to give you a better focus experience.
                We'll be back online shortly.
            </p>

            <button
                onClick={handleRetry}
                disabled={isRetrying}
                style={{
                    marginTop: '32px',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    background: isRetrying ? 'rgba(255,255,255,0.05)' : 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    color: 'white',
                    cursor: isRetrying ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease'
                }}
            >
                {isRetrying ? (
                    <RefreshCw size={18} className="animate-spin" />
                ) : (
                    'Try to reconnect'
                )}
            </button>

            <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default MaintenancePage;
import React from 'react';
import { Settings } from 'lucide-react';

const MaintenancePage = () => {
    return (
        <div style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050505',
            color: 'white',
            textAlign: 'center',
            padding: '20px'
        }}>
            <div className="animate-spin-slow">
                <Settings size={64} color="var(--primary-color, #8b5cf6)" />
            </div>
            <h1 style={{ marginTop: '24px', fontSize: '2rem' }}>Ataraxia is under maintenance</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '12px', maxWidth: '400px' }}>
                We are performing some updates to improve your focus experience. Please check back in a few minutes.
            </p>
            <button
                onClick={() => window.location.reload()}
                style={{
                    marginTop: '32px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    cursor: 'pointer'
                }}
            >
                Try to reconnect
            </button>
        </div>
    );
};

export default MaintenancePage;
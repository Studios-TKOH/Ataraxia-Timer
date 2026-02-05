import React from 'react';
import { createPortal } from 'react-dom';
import TimerWidget from './TimerWidget';

const PipPortal = ({
    pipWindow,
    togglePip,
    timerProps,
    bgImage
}) => {
    if (!pipWindow) return null;

    return createPortal(
        <div className="pip-container" style={{
            width: '100%', height: '100vh',
            backgroundImage: bgImage ? `url(${bgImage})` : 'none',
            backgroundColor: '#050505',
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <TimerWidget
                    {...timerProps}
                    togglePip={togglePip}
                    isPipActive={true}
                    isInPipMode={true}
                />
            </div>
        </div>,
        pipWindow.document.body
    );
};

export default PipPortal;
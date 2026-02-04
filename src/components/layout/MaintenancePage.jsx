import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, Settings } from 'lucide-react';
import FocusFlight from '../games/FocusFlight';

const MaintenancePage = () => {
    const [isRetrying, setIsRetrying] = useState(false);
    const [showGame, setShowGame] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => { window.location.href = '/'; }, 1500);
    };

    return (
        <div className="maintenance-wrapper">
            <Settings size={60} className="animate-spin-slow icon-purple" />
            <h1>Ataraxia is under maintenance</h1>
            <p>The server is currently offline. You can try to reconnect or enter the minigame.</p>

            <div className="button-group">
                <button onClick={handleRetry} disabled={isRetrying} className="maint-btn primary">
                    <RefreshCw size={20} className={isRetrying ? 'animate-spin' : ''} />
                    Try Reconnect
                </button>
                <button onClick={() => setShowGame(true)} className="maint-btn secondary">
                    <Play size={20} />
                    Mini-Game
                </button>
            </div>

            {showGame && <FocusFlight onClose={() => setShowGame(false)} />}

            <style>{`
        .maintenance-wrapper {
          height: 100vh; width: 100vw; background: #050505; color: white;
          display: flex; flexDirection: column; alignItems: center; justifyContent: center;
          position: fixed; top: 0; left: 0; zIndex: 9999; textAlign: center; padding: 20px;
        }
        .icon-purple { color: #8b5cf6; marginBottom: 20px; }
        .button-group { display: flex; gap: 15px; marginTop: 30px; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .maint-btn { 
          display: flex; alignItems: center; gap: 10px; padding: 12px 24px; 
          border-radius: 12px; cursor: pointer; font-weight: 600; border: 1px solid rgba(255,255,255,0.1);
        }
        .primary { background: #8b5cf6; color: white; border: none; }
        .secondary { background: rgba(255,255,255,0.05); color: white; }

        .game-modal {
          position: fixed; inset: 0; background: rgba(0,0,0,0.9);
          backdrop-filter: blur(10px); display: flex; alignItems: center;
          justify-content: center; z-index: 10000;
        }
        .game-container { background: #0a0a0a; border: 1px solid #8b5cf6; border-radius: 20px; width: 340px; overflow: hidden; }
        .game-header { padding: 15px; display: flex; justify-content: space-between; align-items: center; color: #8b5cf6; }
        .close-btn { background: none; border: none; color: #666; cursor: pointer; }
        .canvas-wrapper { position: relative; cursor: pointer; }
        .score-overlay { position: absolute; top: 20px; width: 100%; text-align: center; font-size: 2rem; font-weight: bold; pointer-events: none; opacity: 0.5; }
        .game-over-screen { position: absolute; inset: 0; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .restart-btn { margin-top: 15px; padding: 10px 20px; background: #8b5cf6; border: none; border-radius: 20px; color: white; cursor: pointer; }
      `}</style>
        </div>
    );
};

export default MaintenancePage;
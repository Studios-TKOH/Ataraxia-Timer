import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Volume2, VolumeX, Maximize, HelpCircle, Trophy } from 'lucide-react';

const RightDock = ({
    isActive,
    volume,
    setVolume,
    toggleMute,
    setIsSettingsOpen,
    setIsSupportOpen,
    toggleFullScreen
}) => {
    const handleAchievementsClick = (e) => {
        toast('Achievements: Coming Soon! 🏆', {
            icon: '🚀',
            style: {
                borderRadius: '10px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
            },
        });
    };
    return (
        <div className={`dock-container dock-right ${isActive ? 'dock-hidden' : ''}`}>
            <div className="volume-wrapper">
                <div className="volume-popup">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="vertical-slider"
                    />
                </div>
                <button onClick={toggleMute} className="dock-btn" title="Volume">
                    {volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
            </div>

            <button
                onClick={handleAchievementsClick}
                className="dock-btn"
                title="Achievements"
            >
                <Trophy size={22} />
            </button>

            <button onClick={() => setIsSettingsOpen(true)} className="dock-btn" title="Settings">
                <Settings size={22} />
            </button>

            <button onClick={toggleFullScreen} className="dock-btn" title="Fullscreen">
                <Maximize size={22} />
            </button>

            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

            <button onClick={() => setIsSupportOpen(true)} className="dock-btn" title="Support">
                <HelpCircle size={22} />
            </button>
        </div>
    );
};

export default RightDock;
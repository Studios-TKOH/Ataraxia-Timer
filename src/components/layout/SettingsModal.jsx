import React, { useEffect, useRef } from 'react';
import { X, Sun, Monitor, Upload, Volume2, VolumeX, Clock } from 'lucide-react';

const SettingsModal = ({
    isOpen, onClose,
    currentBg, onBgChange,
    accentColor, onColorChange,
    timerSettings, onTimerChange,
    autoStart, onAutoStartChange,
    longBreakInterval, onLongBreakIntervalChange,
    is24Hour, onFormatChange,
    volume, onVolumeChange
}) => {

    const lastVolumeRef = useRef(0.5);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const safeVolume = Math.min(1, Math.max(0, Number(volume ?? 0.5)));
    const volPercentage = Math.round(safeVolume * 100);

    const handleVolumeChange = (e) => {
        onVolumeChange(Number(e.target.value));
    };

    const toggleMute = () => {
        if (safeVolume > 0) {
            lastVolumeRef.current = safeVolume;
            onVolumeChange(0);
        } else {
            onVolumeChange(lastVolumeRef.current || 0.5);
        }
    };

    const playTestAlarm = () => {
        const audio = new Audio('/sounds/alarm.mp3');
        audio.volume = safeVolume;
        audio.currentTime = 0;
        audio.play().catch(console.error);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => onBgChange(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <span style={{ fontWeight: 600 }}>Settings</span>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                    <div className="setting-section">
                        <div className="setting-label">
                            <Clock size={14} /> Timer (minutes)
                        </div>
                        <div className="time-grid">
                            <TimeInput label="Deep Work" value={timerSettings.work}
                                onChange={(v) => onTimerChange({ ...timerSettings, work: v })} />
                            <TimeInput label="Short Break" value={timerSettings.short}
                                onChange={(v) => onTimerChange({ ...timerSettings, short: v })} />
                            <TimeInput label="Long Break" value={timerSettings.long}
                                onChange={(v) => onTimerChange({ ...timerSettings, long: v })} />
                        </div>
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Monitor size={14} /> System</div>

                        <Row label="Auto-start Cycles">
                            <Switch checked={autoStart} onChange={() => onAutoStartChange(!autoStart)} />
                        </Row>

                        <Row label="Long Break Interval">
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={longBreakInterval}
                                onChange={(e) => onLongBreakIntervalChange(Number(e.target.value) || 1)}
                                className="input-text"
                                style={{ width: 50, textAlign: 'center' }}
                            />
                        </Row>

                        <Row label="24-Hour Clock">
                            <Switch checked={is24Hour} onChange={() => onFormatChange(!is24Hour)} />
                        </Row>
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Sun size={14} /> Appearance</div>

                        <Row label="Theme Color">
                            <div className="color-picker-container">
                                <div className="color-preview" style={{ backgroundColor: accentColor }} />
                                <input
                                    type="color"
                                    value={accentColor}
                                    onChange={(e) => onColorChange(e.target.value)}
                                    className="color-input-real"
                                />
                            </div>
                        </Row>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <span>Background</span>
                            <input
                                type="text"
                                placeholder="Paste image URL..."
                                className="input-text"
                                value={currentBg && !currentBg.startsWith('data:') ? currentBg : ''}
                                onChange={(e) => onBgChange(e.target.value)}
                            />
                            <label className="btn-upload">
                                <Upload size={16} />
                                <span>Upload from PC</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="upload-input-real" />
                            </label>
                        </div>
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Volume2 size={14} /> Sound & Volume</div>

                        <div style={{ padding: 16, borderRadius: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 16 }}>
                                <button onClick={toggleMute} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    {safeVolume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                                </button>

                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={safeVolume}
                                    onChange={handleVolumeChange}
                                    style={{ width: '100%', accentColor }}
                                />

                                <span style={{ minWidth: 40, textAlign: 'right' }}>
                                    {volPercentage}%
                                </span>
                            </div>

                            <button onClick={playTestAlarm} className="btn-upload" style={{ width: '100%' }}>
                                Test Alarm Sound
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const Row = ({ label, children }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span>{label}</span>
        {children}
    </div>
);

const TimeInput = ({ label, value, onChange }) => (
    <div className="time-box">
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className="input-text time-input"
        />
        <label className="time-label">{label}</label>
    </div>
);

const Switch = ({ checked, onChange }) => (
    <div
        onClick={onChange}
        style={{
            width: 44,
            height: 24,
            background: checked ? 'var(--primary-purple)' : 'rgba(255,255,255,0.1)',
            borderRadius: 20,
            position: 'relative',
            cursor: 'pointer'
        }}
    >
        <div
            style={{
                width: 18,
                height: 18,
                background: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: 3,
                left: checked ? 22 : 3,
                transition: 'left 0.3s'
            }}
        />
    </div>
);

export default SettingsModal;
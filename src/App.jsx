import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Settings, Volume2, VolumeX, Music, Maximize, HelpCircle } from 'lucide-react'; // Importamos HelpCircle

import { useTimer } from './hooks/useTimer';
import useLocalStorage from './hooks/useLocalStorage';
import { usePip } from './hooks/usePip';

import Header from './components/layout/Header';
import MissionLog from './components/tasks/MissionLog';
import SettingsModal from './components/layout/SettingsModal';
import TimerWidget from './components/timer/TimerWidget';
import IntroScreen from './components/layout/IntroScreen';
import MusicWidget from './components/layout/MusicWidget';
import SupportModal from './components/layout/SupportModal';

import './styles/global.css';

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('dw-intro-seen');
  });

  const [bgImage, setBgImage] = useLocalStorage('dw-background', '');
  const [accentColor, setAccentColor] = useLocalStorage('dw-color', '#8b5cf6');
  const [timerSettings, setTimerSettings] = useLocalStorage('dw-times', { work: 25, short: 5, long: 15 });
  const [autoStart, setAutoStart] = useLocalStorage('dw-autostart', false);
  const [longBreakInterval, setLongBreakInterval] = useLocalStorage('dw-interval', 4);
  const [is24Hour, setIs24Hour] = useLocalStorage('dw-is24hour', false);
  const [volume, setVolume] = useLocalStorage('dw-volume', 0.5);
  const [playlistUrl, setPlaylistUrl] = useLocalStorage('dw-playlist', '');
  const [isMusicOpen, setIsMusicOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const { pipWindow, togglePip } = usePip();

  const { mode, setMode, formatTime, isActive, toggleTimer, resetTimer, cycles } = useTimer(
    'work', timerSettings, autoStart, longBreakInterval, volume
  );

  const toggleMute = () => {
    setVolume(volume === 0 ? 0.5 : 0);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleIntroComplete = () => {
    sessionStorage.setItem('dw-intro-seen', 'true');
    setShowIntro(false);
  };

  return (
    <div style={{
      width: '100%',
      '--primary-color': accentColor,
      '--primary-glow': `${accentColor}80`
    }}>
      <div className="background-layer" style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }} />
      <div className="background-overlay" />

      {showIntro && (
        <IntroScreen onComplete={handleIntroComplete} is24Hour={is24Hour} />
      )}

      {pipWindow && createPortal(
        <div style={{
          width: '100%',
          height: '100vh',
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundColor: '#050505',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <TimerWidget
              mode={mode} setMode={setMode}
              formatTime={formatTime} isActive={isActive}
              cycles={cycles} longBreakInterval={longBreakInterval}
              toggleTimer={toggleTimer} resetTimer={resetTimer}
              togglePip={togglePip} isPipActive={true}
              isInPipMode={true}
            />
          </div>
        </div>,
        pipWindow.document.body
      )}

      <MusicWidget
        url={playlistUrl}
        onUrlChange={setPlaylistUrl}
        isOpen={isMusicOpen}
        onClose={() => setIsMusicOpen(false)}
      />

      <div className="app-wrapper">

        <div className={`header-container ${isActive ? 'hidden' : ''}`}>
          <Header is24Hour={is24Hour} />
        </div>

        <main className="main-layout">
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            opacity: pipWindow ? 0.3 : 1,
            filter: pipWindow ? 'blur(2px) grayscale(100%)' : 'none',
            transition: 'all 0.5s ease',
            pointerEvents: pipWindow ? 'none' : 'auto'
          }}>
            <TimerWidget
              mode={mode} setMode={setMode}
              formatTime={formatTime} isActive={isActive}
              cycles={cycles} longBreakInterval={longBreakInterval}
              toggleTimer={toggleTimer} resetTimer={resetTimer}
              togglePip={togglePip}
              isPipActive={!!pipWindow}
              isInPipMode={false}
            />
          </div>

          <section className="tasks-section">
            <MissionLog />
          </section>

        </main>

        <div className={`dock-container dock-left ${isActive ? 'dock-hidden' : ''}`}>
          <button
            onClick={() => setIsMusicOpen(!isMusicOpen)}
            className={`dock-btn ${isMusicOpen ? 'active' : ''}`}
            title="Music Player"
          >
            <Music size={22} />
          </button>
        </div>

        <div className={`dock-container dock-right ${isActive ? 'dock-hidden' : ''}`}>
          <div className="volume-wrapper">
            <div className="volume-popup">
              <input
                type="range"
                min="0" max="1" step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="vertical-slider"
              />
            </div>
            <button onClick={toggleMute} className="dock-btn" title="Volume">
              {volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
          </div>

          <button onClick={() => setIsSettingsOpen(true)} className="dock-btn" title="Settings">
            <Settings size={22} />
          </button>

          <button onClick={toggleFullScreen} className="dock-btn" title="Fullscreen">
            <Maximize size={22} />
          </button>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }}></div>

          <button onClick={() => setIsSupportOpen(true)} className="dock-btn" title="Support & Feedback">
            <HelpCircle size={22} />
          </button>
        </div>

      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentBg={bgImage} onBgChange={setBgImage}
        accentColor={accentColor} onColorChange={setAccentColor}
        timerSettings={timerSettings} onTimerChange={setTimerSettings}
        autoStart={autoStart} onAutoStartChange={setAutoStart}
        longBreakInterval={longBreakInterval} onLongBreakIntervalChange={setLongBreakInterval}
        is24Hour={is24Hour} onFormatChange={setIs24Hour}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}

export default App;
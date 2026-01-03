import React, { useState, useEffect } from 'react';
import { X, ListMusic, ArrowRight } from 'lucide-react';

const MusicWidget = ({ url, onUrlChange, isOpen, onClose }) => {
    const [inputValue, setInputValue] = useState('');
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setInputValue(url || '');
            if (!getEmbedUrl(url)) {
                setShowInput(true);
            } else {
                setShowInput(false);
            }
        }
    }, [isOpen, url]);

    if (!isOpen) return null;

    const getEmbedUrl = (inputUrl) => {
        if (!inputUrl) return null;
        try {
            const spotifyMatch = inputUrl.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
            if (spotifyMatch) {
                const [_, type, id] = spotifyMatch;
                return `https://open.spotify.com/embed/${type}/${id}`;
            }

            if (inputUrl.includes('youtube.com') || inputUrl.includes('youtu.be')) {
                let videoId = '';
                if (inputUrl.includes('v=')) {
                    videoId = inputUrl.split('v=')[1].split('&')[0];
                } else if (inputUrl.includes('youtu.be/')) {
                    videoId = inputUrl.split('youtu.be/')[1];
                } else if (inputUrl.includes('embed/')) {
                    videoId = inputUrl.split('embed/')[1];
                }

                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0`;
                }
            }

            if (inputUrl.includes('soundcloud.com')) {
                return `https://w.soundcloud.com/player/?url=${encodeURIComponent(inputUrl)}&color=%238b5cf6&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
            }

            return null;
        } catch (e) { return null; }
    };

    const handleLoad = () => {
        onUrlChange(inputValue);
        setShowInput(false);
    };

    const embedUrl = getEmbedUrl(url);
    const isFormVisible = showInput || !embedUrl;

    return (
        <>
            <div style={{
                position: 'fixed',
                bottom: '90px',
                left: '2rem',
                width: '380px',
                background: 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                zIndex: 45,
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                transformOrigin: 'bottom left',
                animation: 'widgetPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                ...(window.innerWidth < 768 && {
                    left: '50%', transform: 'translateX(-50%)', bottom: '85px', width: '90%', transformOrigin: 'bottom center'
                })
            }}>

                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ListMusic size={16} color="var(--primary-purple)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', letterSpacing: '0.5px' }}>
                            MY MUSIC
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {!isFormVisible && (
                            <button
                                onClick={() => setShowInput(true)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Change
                            </button>
                        )}
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div style={{ minHeight: '150px', background: '#050505', display: 'flex', flexDirection: 'column' }}>

                    {isFormVisible ? (
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600, color: 'white' }}>Custom Playlists</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                    Paste a link from Spotify, YouTube, or SoundCloud
                                </p>
                                <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#eab308', opacity: 0.9 }}>
                                    *Tip: Use YouTube for full uninterrupted playback :)
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Paste URL here..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        padding: '10px 12px',
                                        color: 'white',
                                        fontSize: '0.85rem',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={handleLoad}
                                    style={{
                                        background: 'var(--primary-purple)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0 12px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            height: url && url.includes('spotify') ? '152px' : '215px',
                            width: '100%',
                            position: 'relative'
                        }}>
                            <iframe
                                src={embedUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                title="My Music"
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes widgetPop {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 768px) {
            @keyframes widgetPop {
                from { opacity: 0; transform: translateX(-50%) scale(0.95) translateY(10px); }
                to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
            }
        }
      `}</style>
        </>
    );
};

export default MusicWidget;
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../../api/spotify.service';

const SpotifyCallback = () => {
    const navigate = useNavigate();
    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            spotifyService.getAccessToken(code)
                .then(() => {
                    window.history.replaceState({}, document.title, "/");
                    window.dispatchEvent(new Event('spotify-token-updated'));
                    navigate('/');
                })
                .catch(err => {
                    console.error("Error en callback:", err);
                    navigate('/');
                });
        } else {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div style={{
            height: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: 'sans-serif',
            gap: '20px'
        }}>
            <div style={{
                width: '40px', height: '40px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: '#1db954',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <h3 style={{ fontWeight: 400, opacity: 0.8 }}>Conectando con Spotify...</h3>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default SpotifyCallback;
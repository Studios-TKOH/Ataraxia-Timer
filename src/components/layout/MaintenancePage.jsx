import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, Play, Settings, X } from 'lucide-react';

const MaintenancePage = () => {
    const [isRetrying, setIsRetrying] = useState(false);
    const [showGame, setShowGame] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const canvasRef = useRef(null);
    const requestRef = useRef();

    const bird = useRef({ x: 50, y: 150, width: 20, height: 20, gravity: 0.6, lift: -8, velocity: 0 });
    const pipes = useRef([]);
    const frameCount = useRef(0);

    useEffect(() => {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = 'unset';
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        if (!showGame || gameOver) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const update = () => {
            bird.current.velocity += bird.current.gravity;
            bird.current.y += bird.current.velocity;

            if (bird.current.y + bird.current.height > canvas.height || bird.current.y < 0) {
                setGameOver(true);
                return;
            }

            if (frameCount.current % 100 === 0) {
                const gap = 130;
                const height = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
                pipes.current.push({ x: canvas.width, top: height, bottom: canvas.height - height - gap, width: 40 });
            }

            pipes.current.forEach((pipe, index) => {
                pipe.x -= 2;
                if (
                    bird.current.x < pipe.x + pipe.width &&
                    bird.current.x + bird.current.width > pipe.x &&
                    (bird.current.y < pipe.top || bird.current.y + bird.current.height > canvas.height - pipe.bottom)
                ) {
                    setGameOver(true);
                }
                if (pipe.x + pipe.width === bird.current.x) setScore(s => s + 1);
                if (pipe.x + pipe.width < 0) pipes.current.splice(index, 1);
            });

            draw(ctx, canvas);
            frameCount.current++;
            requestRef.current = requestAnimationFrame(update);
        };

        const draw = (ctx, canvas) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#8b5cf6';
            ctx.beginPath();
            ctx.arc(bird.current.x + 10, bird.current.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            pipes.current.forEach(pipe => {
                ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
                ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
            });
        };

        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current);
    }, [showGame, gameOver]);

    const handleJump = () => {
        if (gameOver) {
            bird.current.y = 150;
            bird.current.velocity = 0;
            pipes.current = [];
            setScore(0);
            setGameOver(false);
        } else {
            bird.current.velocity = bird.current.lift;
        }
    };

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => { window.location.href = '/'; }, 1500);
    };

    return (
        <div style={{
            height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', background: '#050505',
            color: 'white', position: 'fixed', top: 0, left: 0, zIndex: 9999
        }}>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <Settings size={50} className="animate-spin-slow" style={{ color: '#8b5cf6', marginBottom: '20px' }} />
                <h1 style={{ fontSize: '2rem', fontWeight: '600' }}>Station Maintenance</h1>
                <p style={{ color: '#9ca3af', marginTop: '10px' }}>Connection lost. Choose your next action.</p>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <button onClick={handleRetry} disabled={isRetrying} className="maint-btn primary">
                    {isRetrying ? <RefreshCw size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                    Try Reconnect
                </button>

                <button onClick={() => setShowGame(true)} className="maint-btn secondary">
                    <Play size={20} />
                    Training Mode
                </button>
            </div>

            {showGame && (
                <div className="game-modal" onClick={handleJump}>
                    <div className="game-container" onClick={e => e.stopPropagation()}>
                        <div className="game-header">
                            <span>Focus Flight</span>
                            <button onClick={() => { setShowGame(false); setGameOver(false); }} className="close-btn">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="canvas-wrapper" onClick={handleJump}>
                            <canvas ref={canvasRef} width={320} height={450} />
                            <div className="score-overlay">{score}</div>

                            {gameOver && (
                                <div className="game-over-screen">
                                    <h2>FLOW INTERRUPTED</h2>
                                    <p>Score: {score}</p>
                                    <button onClick={handleJump} className="restart-btn">Restart Simulation</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .maint-btn {
          display: flex; alignItems: center; gap: 10px;
          padding: 12px 24px; border-radius: 12px; cursor: pointer;
          font-weight: 500; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1);
        }
        .primary { background: #8b5cf6; color: white; border: none; }
        .primary:hover { background: #7c3aed; transform: translateY(-2px); }
        .secondary { background: rgba(255,255,255,0.05); color: white; }
        .secondary:hover { background: rgba(255,255,255,0.1); }

        .game-modal {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px); display: flex; alignItems: center;
          justify-content: center; z-index: 10000;
        }
        .game-container {
          background: #0a0a0a; border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px; overflow: hidden; width: 320px;
        }
        .game-header {
          padding: 15px; display: flex; justifyContent: space-between;
          alignItems: center; border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.9rem; letter-spacing: 1px; color: #8b5cf6;
        }
        .close-btn { background: none; border: none; color: #666; cursor: pointer; }
        .canvas-wrapper { position: relative; cursor: pointer; }
        canvas { display: block; background: #050505; }
        .score-overlay {
          position: absolute; top: 15px; right: 20px;
          font-size: 1.5rem; font-weight: bold; pointer-events: none;
        }
        .game-over-screen {
          position: absolute; inset: 0; background: rgba(0,0,0,0.8);
          display: flex; flexDirection: column; alignItems: center;
          justify-content: center; text-align: center;
        }
        .game-over-screen h2 { color: #ef4444; font-size: 1.2rem; margin-bottom: 10px; }
        .restart-btn {
          margin-top: 20px; padding: 8px 20px; border-radius: 20px;
          background: #8b5cf6; border: none; color: white; cursor: pointer;
        }
      `}</style>
        </div>
    );
};

export default MaintenancePage;
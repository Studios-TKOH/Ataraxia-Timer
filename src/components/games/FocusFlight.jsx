import React, { useEffect, useState, useRef } from 'react';
import { X, Trophy } from 'lucide-react';

const FocusFlight = ({ onClose }) => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => localStorage.getItem('focus-flight-hi') || 0);
    const [gameState, setGameState] = useState('getReady');
    const requestRef = useRef();

    const canvasWidth = 276;
    const canvasHeight = 414;
    const RAD = Math.PI / 180;

    const frames = useRef(0);
    const bird = useRef({
        x: 50, y: 150, radius: 12,
        gravity: 0.25, thrust: 4.5, velocity: 0, rotation: 0
    });
    const pipes = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const update = () => {
            frames.current++;

            if (gameState === 'play') {
                bird.current.velocity += bird.current.gravity;
                bird.current.y += bird.current.velocity;

                if (bird.current.velocity <= 0) {
                    bird.current.rotation = Math.max(-25, (-25 * bird.current.velocity) / (-1 * bird.current.thrust));
                } else {
                    bird.current.rotation = Math.min(90, (90 * bird.current.velocity) / (bird.current.thrust * 2));
                }

                if (frames.current % 100 === 0) {
                    const gap = 90;
                    const top = -210 * Math.min(Math.random() + 1, 1.8);
                    pipes.current.push({ x: canvasWidth, y: top, gap, passed: false });
                }

                pipes.current.forEach((p, i) => {
                    p.x -= 2;

                    if (bird.current.x + bird.current.radius > p.x && bird.current.x - bird.current.radius < p.x + 50) {
                        if (bird.current.y - bird.current.radius < p.y + 400 || bird.current.y + bird.current.radius > p.y + 400 + p.gap) {
                            handleGameOver();
                        }
                    }

                    if (!p.passed && p.x + 50 < bird.current.x) {
                        p.passed = true;
                        setScore(s => s + 1);
                    }

                    if (p.x + 50 < 0) pipes.current.splice(i, 1);
                });

                if (bird.current.y + bird.current.radius >= canvasHeight) handleGameOver();
            }

            draw(ctx);
            requestRef.current = requestAnimationFrame(update);
        };

        const draw = (ctx) => {
            ctx.fillStyle = "#30c0df";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.fillStyle = "#73bf2e";
            pipes.current.forEach(p => {
                ctx.fillRect(p.x, 0, 50, p.y + 400);
                ctx.fillRect(p.x, p.y + 400 + p.gap, 50, canvasHeight);
            });

            ctx.save();
            ctx.translate(bird.current.x, bird.current.y);
            ctx.rotate(bird.current.rotation * RAD);
            ctx.fillStyle = "#8b5cf6";
            ctx.beginPath();
            ctx.arc(0, 0, bird.current.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.fillStyle = "white";
            ctx.font = "24px Squada One";
            ctx.textAlign = "center";
            ctx.fillText(score, canvasWidth / 2, 50);
        };

        const handleGameOver = () => {
            setGameState('gameOver');
            if (score > highScore) {
                localStorage.setItem('focus-flight-hi', score);
                setHighScore(score);
            }
        };

        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, score, highScore]);

    const handleInteraction = (e) => {
        if (e) e.preventDefault();
        if (gameState === 'getReady') {
            setGameState('play');
            bird.current.velocity = bird.current.thrust * -1;
        } else if (gameState === 'play') {
            bird.current.velocity = bird.current.thrust * -1;
        } else if (gameState === 'gameOver') {
            bird.current.y = 150;
            bird.current.velocity = 0;
            pipes.current = [];
            setScore(0);
            setGameState('getReady');
        }
    };

    return (
        <div className="game-modal" onMouseDown={handleInteraction} onTouchStart={handleInteraction}>
            <div className="game-container" onMouseDown={e => e.stopPropagation()}>
                <div className="game-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trophy size={16} /> <span>BEST: {highScore}</span>
                    </div>
                    <span className="game-title">Focus Flight</span>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <div className="canvas-wrapper">
                    <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />

                    {gameState === 'getReady' && (
                        <div className="game-overlay">
                            <h2 style={{ color: '#8b5cf6' }}>READY?</h2>
                            <p>Click to start flight</p>
                        </div>
                    )}

                    {gameState === 'gameOver' && (
                        <div className="game-overlay" style={{ background: 'rgba(0,0,0,0.8)' }}>
                            <h2 style={{ color: '#ef4444' }}>LOST FLOW</h2>
                            <p>Final Score: {score}</p>
                            <button className="restart-btn" onClick={handleInteraction}>Try Again</button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .game-modal {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.9);
                    backdrop-filter: blur(10px); display: flex; align-items: center;
                    justify-content: center; z-index: 10000;
                }
                .game-container {
                    background: #0a0a0a; border: 1px solid rgba(139, 92, 246, 0.4);
                    border-radius: 20px; width: 276px; overflow: hidden;
                    box-shadow: 0 0 30px rgba(139, 92, 246, 0.2);
                }
                .game-header {
                    padding: 12px; display: flex; justify-content: space-between;
                    align-items: center; background: #111; font-size: 0.8rem;
                }
                .game-title { color: #8b5cf6; font-weight: bold; letter-spacing: 1px; }
                .close-btn { background: none; border: none; color: #555; cursor: pointer; }
                .canvas-wrapper { position: relative; cursor: pointer; }
                .game-overlay {
                    position: absolute; inset: 0; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; text-align: center;
                    pointer-events: none;
                }
                .restart-btn {
                    margin-top: 15px; padding: 8px 20px; border-radius: 20px;
                    background: #8b5cf6; border: none; color: white; cursor: pointer;
                    pointer-events: auto; font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default FocusFlight;
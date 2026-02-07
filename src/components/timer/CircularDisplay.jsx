import React from 'react';

const CircularDisplay = ({ time, isActive, mode }) => {
    const radius = 120;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const getStatusText = () => {
        if (mode === 'short' || mode === 'long') {
            return 'BREAK';
        }
        return isActive ? 'FOCUSING' : 'READY';
    };

    return (
        <div className="circular-display-container">
            <style>{`
                .circular-display-container {
                    position: relative;
                    width: 240px;
                    height: 240px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s ease;
                }

                .timer-svg {
                    transform: rotate(-90deg);
                    overflow: visible;
                    width: 100%;
                    height: 100%;
                }

                .timer-text-content {
                    position: absolute;
                    text-align: center;
                    user-select: none;
                }

                .timer-digits {
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin: 0;
                    font-variant-numeric: tabular-nums;
                    text-shadow: 0 0 20px var(--primary-glow);
                    color: white;
                    line-height: 1;
                }

                .timer-status {
                    margin: 8px 0 0 0;
                    font-size: 0.85rem;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    opacity: 0.7;
                    font-weight: 600;
                    color: white;
                }
                
                @media (max-width: 425px) {
                    .circular-display-container {
                        width: 210px;
                        height: 210px;
                    }
                    .timer-digits { font-size: 3rem; }
                }

                @media (max-width: 375px) {
                    .circular-display-container {
                        width: 190px;
                        height: 190px;
                    }
                    .timer-digits { font-size: 2.8rem; }
                    .timer-status { font-size: 0.75rem; letter-spacing: 2px; }
                }

                @media (max-width: 320px) {
                    .circular-display-container {
                        width: 170px;
                        height: 170px;
                    }
                    .timer-digits { font-size: 2.4rem; }
                }
            `}</style>

            <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`} className="timer-svg">
                <circle
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="var(--primary-color)"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{
                        strokeDashoffset: isActive ? 0 : circumference,
                        transition: 'stroke-dashoffset 0.5s linear'
                    }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>

            <div className="timer-text-content">
                <h1 className="timer-digits">
                    {time}
                </h1>
                <p className="timer-status">
                    {getStatusText()}
                </p>
            </div>
        </div>
    );
};

export default CircularDisplay;
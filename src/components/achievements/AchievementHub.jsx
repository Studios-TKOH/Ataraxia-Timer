import React from 'react';
import { useAchievements } from '../../context/achievement-context';
import { Trophy, Lock } from 'lucide-react';

const AchievementHub = () => {
    const { achievements, loading } = useAchievements();

    return (
        <section className="achievements-section" aria-labelledby="achievements-title">
            <h2 id="achievements-title" className="sr-only">Ataraxia Accomplishments</h2>

            <div className="achievements-grid">
                {achievements.map((item) => (
                    <article
                        key={item.id}
                        className={`achievement-card ${item.isUnlocked ? 'unlocked' : 'locked'}`}
                        itemScope itemType="https://schema.org/CreativeWork"
                    >
                        <div className="status-icon">
                            {item.isUnlocked ? <Trophy size={20} color="var(--primary-purple)" /> : <Lock size={20} />}
                        </div>

                        <div className="content">
                            <h3 itemProp="name">{item.title}</h3>
                            <p itemProp="description">{item.description}</p>

                            {item.target > 1 && (
                                <div className="progress-container">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${(item.currentValue / item.target) * 100}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            <style>{`
                .achievements-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 15px;
                    padding: 20px;
                }
                .achievement-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    gap: 12px;
                    backdrop-filter: blur(10px);
                }
                .achievement-card.unlocked {
                    border-color: var(--primary-purple);
                    background: rgba(139, 92, 246, 0.05);
                }
                .achievement-card h3 { font-size: 0.95rem; margin: 0; color: white; }
                .achievement-card p { font-size: 0.8rem; color: var(--text-muted); margin: 4px 0; }
                .progress-container { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 8px; }
                .progress-bar { height: 100%; background: var(--primary-purple); border-radius: 2px; transition: width 0.3s; }
            `}</style>
        </section>
    );
};

export default AchievementHub;
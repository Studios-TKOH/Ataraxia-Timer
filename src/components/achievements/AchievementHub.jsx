import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trophy, Users, Award, Lock, Loader2 } from 'lucide-react';
import { fetchAchievementsRequest, fetchLeaderboardRequest } from '../../store/slices/achievementsSlice';

const AchievementHub = () => {
    const [activeTab, setActiveTab] = useState('medals');
    const dispatch = useDispatch();
    const { list, unlockedIds, leaderboard, stats, loading } = useSelector(state => state.achievements);

    useEffect(() => {
        dispatch(fetchAchievementsRequest());
        dispatch(fetchLeaderboardRequest());
    }, [dispatch]);

    return (
        <div className="achievement-hub">
            <div className="hub-stats">
                <div className="stat-item">
                    <span className="label">Streak</span>
                    <span className="value">{stats.currentStreak} 🔥</span>
                </div>
                <div className="stat-item">
                    <span className="label">Total XP</span>
                    <span className="value">{stats.totalExperience}</span>
                </div>
            </div>

            {/* Tab Selector */}
            <div className="tabs-navigation">
                <button
                    className={activeTab === 'medals' ? 'active' : ''}
                    onClick={() => setActiveTab('medals')}
                >
                    <Award size={18} /> My Medals
                </button>
                <button
                    className={activeTab === 'ranking' ? 'active' : ''}
                    onClick={() => setActiveTab('ranking')}
                >
                    <Users size={18} /> Ranking
                </button>
            </div>

            <div className="tab-content">
                {loading && <Loader2 className="mx-auto my-4 animate-spin" />}

                {activeTab === 'medals' ? (
                    <div className="medals-grid">
                        {list.map(ach => (
                            <div key={ach.id} className={`medal-card ${unlockedIds.includes(ach.id) ? 'unlocked' : 'locked'}`}>
                                {unlockedIds.includes(ach.id) ? <Award /> : <Lock />}
                                <h4>{ach.name}</h4>
                                <p>{ach.description}</p>
                                <span className="points">+{ach.points} XP</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="ranking-list">
                        {leaderboard.map((user) => (
                            <div key={user.userId} className={`ranking-item rank-${user.rank}`}>
                                <span className="position">#{user.rank}</span>
                                <span className="username">{user.username}</span>
                                <span className="xp">{user.experience} XP</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
            .achievement-hub { background: #1a1a1a; border-radius: 12px; padding: 20px; color: white; }
            .tabs-navigation { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; }
            .tabs-navigation button { background: none; border: none; color: #666; cursor: pointer; display: flex; align-items: center; gap: 5px; }
            .tabs-navigation button.active { color: #ffd700; font-weight: bold; }
            .medals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; }
            .medal-card { padding: 15px; border-radius: 8px; text-align: center; background: #222; border: 1px solid #333; transition: transform 0.2s; }
            .medal-card.locked { opacity: 0.5; filter: grayscale(1); }
            .medal-card.unlocked { border-color: #ffd700; box-shadow: 0 0 10px rgba(255, 215, 0, 0.1); }
            .ranking-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #222; align-items: center; }
            .rank-1 { color: #ffd700; font-weight: bold; }
        `}</style>
        </div>
    );
};

export default AchievementHub;
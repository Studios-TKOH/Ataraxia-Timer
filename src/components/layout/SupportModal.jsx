import React, { useEffect } from 'react';
import { X, Bug, MessageSquare, Heart, Github } from 'lucide-react';

const SupportModal = ({ isOpen, onClose }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '380px' }}>

                <div className="modal-header">
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>Support & Feedback</span>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                        Encountered a bug or have a feature in mind? We'd love to hear from you to make Ataraxia better.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                        <a href="mailto:studiostkoh@gmail.com?subject=Bug Report - Ataraxia Timer" style={{ textDecoration: 'none' }}>
                            <div className="support-item">
                                <div className="bg-red support-icon"><Bug size={18} color="#f87171" /></div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="support-title">Report a Bug</span>
                                    <span className="support-desc">Something isn't working right</span>
                                </div>
                            </div>
                        </a>

                        <a href="mailto:studiostkoh@gmail.com?subject=Feedback - Ataraxia Timer" style={{ textDecoration: 'none' }}>
                            <div className="support-item">
                                <div className="bg-blue support-icon"><MessageSquare size={18} color="#60a5fa" /></div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="support-title">Share Feedback</span>
                                    <span className="support-desc">Suggest features or improvements</span>
                                </div>
                            </div>
                        </a>

                        <a href="https://github.com/VaCris/Ataraxia-Timer" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <div className="support-item">
                                <div className="bg-dark support-icon"><Github size={18} color="white" /></div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="support-title">Contribute</span>
                                    <span className="support-desc">Check the code on GitHub</span>
                                </div>
                            </div>
                        </a>

                        {/* <div style={{ marginTop: '1rem', padding: '15px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Heart size={20} fill="#8b5cf6" color="#8b5cf6" />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                Enjoying the app? <strong style={{ color: '#8b5cf6', cursor: 'pointer' }}>Buy me a coffee</strong>
                            </span>
                        </div> */}

                    </div>
                </div>
            </div>

            <style>{`
                .support-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid transparent;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                .support-item:hover {
                    background: rgba(255,255,255,0.08);
                    border-color: var(--glass-border);
                    transform: translateX(4px);
                }
                .support-icon {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                }
                .bg-red { background: rgba(248, 113, 113, 0.2); }
                .bg-blue { background: rgba(96, 165, 250, 0.2); }
                .bg-dark { background: rgba(255, 255, 255, 0.1); }
                
                .support-title { font-size: 0.95rem; font-weight: 600; color: white; }
                .support-desc { font-size: 0.8rem; color: var(--text-muted); }
            `}</style>
        </div>
    );
};

export default SupportModal;
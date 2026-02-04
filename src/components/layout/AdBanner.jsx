import React, { useEffect } from 'react';

const AdBanner = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className="silent-ad-wrapper">
            <span className="ad-tag">Sponsor</span>
            <ins className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-1658820568225338"
                data-ad-slot="2916462747"></ins>

            <style>{`
                .silent-ad-wrapper {
                    margin-top: 20px;
                    padding: 10px;
                    opacity: 0.4;
                    transition: opacity 0.3s ease;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--glass-border);
                    position: relative;
                    overflow: hidden;
                    min-height: 80px;
                }
                .silent-ad-wrapper:hover { opacity: 1; }
                .ad-tag {
                    position: absolute; top: 2px; right: 8px;
                    font-size: 0.6rem; color: var(--text-muted);
                    text-transform: uppercase; pointer-events: none;
                    z-index: 10;
                }
            `}</style>
        </div>
    );
};

export default AdBanner;
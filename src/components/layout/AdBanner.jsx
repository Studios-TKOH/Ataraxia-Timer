import React, { useEffect } from 'react';

const AdBanner = () => {
    useEffect(() => {
        const pushAd = () => {
            try {
                if (window.adsbygoogle) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            } catch (e) { }
        };
        const timer = setTimeout(pushAd, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="stealth-ad-container">
            <ins className="adsbygoogle"
                style={{ display: 'inline-block', width: '250px', height: '50px' }}
                data-ad-client="ca-pub-1658820568225338"
                data-ad-slot="2916462747"></ins>

            <style>{`
                .stealth-ad-container {
                    margin: 10px auto;
                    width: 250px;
                    height: 50px;
                    overflow: hidden;
                    opacity: 0.05; 
                    filter: grayscale(1);
                    transition: all 0.5s ease;
                    border-radius: 4px;
                    position: relative;
                }

                .stealth-ad-container:hover {
                    opacity: 0.6;
                    filter: grayscale(0);
                }

                .stealth-ad-container::after {
                    content: 'adv';
                    position: absolute;
                    bottom: 0;
                    right: 2px;
                    font-size: 8px;
                    color: rgba(255,255,255,0.1);
                }
            `}</style>
        </div>
    );
};

export default AdBanner;
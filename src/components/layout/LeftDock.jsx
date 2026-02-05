import React from 'react';
import MusicIndicator from './MusicIndicator';

const LeftDock = ({ isActive }) => {
    return (
        <div className={`dock-container dock-left ${isActive ? 'dock-hidden' : ''}`}>
            <MusicIndicator />
        </div>
    );
};

export default LeftDock;
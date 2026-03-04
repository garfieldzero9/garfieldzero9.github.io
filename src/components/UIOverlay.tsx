import React from 'react';
import type { GameState } from '../App';

interface UIOverlayProps {
    gameState: GameState;
    onStartGame: () => void;
    score: number;
    onBackToHome: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, onStartGame, score, onBackToHome }) => {
    return (
        <>
            {/* Home Screen */}
            <div className={`ui-overlay ${gameState !== 'home' ? 'hidden' : ''}`}>
                <div className="ui-content">
                    <h1 className="title-main">Catch The Lasagna!</h1>
                    <p className="subtitle">The hungriest 3D experience on the web.</p>
                    <button className="btn-play" onClick={onStartGame}>
                        Lets Eat!
                    </button>
                </div>
            </div>

            {/* In-game HUD */}
            <div className={`game-ui ${gameState === 'playing' ? 'visible' : ''}`}>
                Score: {score}
            </div>

            <button
                className={`btn-back ${gameState !== 'home' ? 'visible' : ''}`}
                onClick={onBackToHome}
            >
                Quit
            </button>

            {/* Game Over Screen */}
            <div className={`game-over-ui ${gameState === 'game-over' ? 'visible' : ''}`}>
                <div className="game-over-content">
                    <h2 className="game-over-title">Oof!</h2>
                    <div className="game-over-score">Final Score: {score}</div>
                    <button className="btn-play" onClick={onStartGame}>
                        Play Again
                    </button>
                </div>
            </div>
        </>
    );
};

export default UIOverlay;

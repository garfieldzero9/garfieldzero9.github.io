import React from 'react';
import type { GameState } from '../App';

interface UIOverlayProps {
    gameState: GameState;
    onStartGame: () => void;
    score: number;
    highScore: number;
    onBackToHome: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, onStartGame, score, highScore, onBackToHome }) => {
    return (
        <>
            {/* Home Screen */}
            <div className={`ui-overlay ${gameState !== 'home' ? 'hidden' : ''}`}>
                <div className="ui-content">
                    <h1 className="title-main">Catch The Lasagna!</h1>
                    <p className="subtitle">The hungriest 3D experience on the web.</p>
                    {highScore > 0 && (
                        <div className="high-score-display" style={{ marginBottom: '1.5rem', fontFamily: '"Titan One", cursive', color: 'var(--cheese-yellow)', WebkitTextStroke: '1px var(--dark-accent)' }}>
                            Personal Best: {highScore}
                        </div>
                    )}
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
                    {score >= highScore && score > 0 && (
                        <div className="new-high-score" style={{ marginBottom: '1rem', color: 'var(--cheese-yellow)', fontFamily: '"Titan One", cursive', WebkitTextStroke: '1px var(--dark-accent)', animation: 'pulse 1s infinite' }}>
                            New High Score!
                        </div>
                    )}
                    <button className="btn-play" onClick={onStartGame}>
                        Play Again
                    </button>
                </div>
            </div>
        </>
    );
};

export default UIOverlay;

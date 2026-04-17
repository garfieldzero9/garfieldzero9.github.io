import { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import UIOverlay from './components/UIOverlay.tsx';
import GameScene from './components/GameScene.tsx';

export type GameState = 'home' | 'playing' | 'game-over';

function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const savedScore = localStorage.getItem('garfield_high_score');
    if (savedScore) {
      setHighScore(parseInt(savedScore, 10));
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (gameState === 'playing') {
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser. User must interact first.", e));
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [gameState]);

  const checkHighScore = (currentScore: number) => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('garfield_high_score', currentScore.toString());
    }
  };

  const handleStartGame = () => {
    setScore(0);
    setGameState('playing');
  };

  const handleGameOver = () => {
    checkHighScore(score);
    setGameState('game-over');
  };

  const handleBackToHome = () => {
    checkHighScore(score);
    setGameState('home');
  };

  return (
    <>
      <UIOverlay
        gameState={gameState}
        onStartGame={handleStartGame}
        score={score}
        highScore={highScore}
        onBackToHome={handleBackToHome}
      />

      <audio ref={audioRef} src="/bgm.mp3" loop />

      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 5, 15], fov: 45 }}
          shadows
        >
          <color attach="background" args={['#0b090a']} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Suspense fallback={null}>
            <GameScene
              gameState={gameState}
              score={score}
              onScore={(points: number) => setScore(s => s + points)}
              onGameOver={handleGameOver}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Lasagna from './Models/Lasagna';

interface GameLogicProps {
    isPlaying: boolean;
    onScore: (points: number) => void;
    onGameOver: () => void;
}

interface SpawnedLasagna {
    id: number;
    position: [number, number, number];
}

const GameLogic: React.FC<GameLogicProps> = ({ isPlaying, onScore, onGameOver }) => {
    const [lasagnas, setLasagnas] = useState<SpawnedLasagna[]>([]);
    const missedCount = useRef(0);
    const spawnTimer = useRef(0);
    const currentId = useRef(0);

    // Spawn logic
    useFrame((_state, delta) => {
        if (!isPlaying) return;

        spawnTimer.current += delta;

        // Spawn every 1.5 seconds, getting faster as score goes up
        // Simplification for demo: constant rate
        if (spawnTimer.current > 1.2) {
            spawnTimer.current = 0;

            // Spawn within the bounds of the viewport to keep them on screen for mobile
            const viewportWidth = _state.viewport.width;
            const bounds = (viewportWidth / 2) - 1.5; // Keep away from exact edges
            const x = (Math.random() - 0.5) * (bounds * 2);

            setLasagnas(prev => [...prev.slice(-10), {
                id: ++currentId.current,
                // Spawn high above camera
                position: [x, 15, 0]
            }]);
        }
    });

    // Reset when game starts
    useEffect(() => {
        if (isPlaying) {
            setLasagnas([]);
            missedCount.current = 0;
            spawnTimer.current = 0;
        }
    }, [isPlaying]);

    const handleMiss = () => {
        if (!isPlaying) return;
        missedCount.current += 1;
        if (missedCount.current >= 3) {
            onGameOver();
        }
    };

    return (
        <>
            {lasagnas.map(l => (
                <Lasagna
                    key={`lasagna-${l.id}`}
                    position={l.position}
                    onCatch={() => onScore(100)}
                    onMiss={handleMiss}
                />
            ))}
        </>
    );
};

export default GameLogic;

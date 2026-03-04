import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import type { GameState } from '../App';
import GameLogic from './GameLogic';
import Catcher from './Catcher';
import Lasagna from './Models/Lasagna';

interface GameSceneProps {
    gameState: GameState;
    score: number;
    onScore: (points: number) => void;
    onGameOver: () => void;
}

const FloatingDecor: React.FC = () => {
    const group = useRef<any>(null)
    useFrame((state) => {
        if (!group.current) return;
        const time = state.clock.getElapsedTime();
        group.current.position.y = Math.sin(time) * 0.5;
        group.current.rotation.y = time * 0.2;
    })

    return (
        <group ref={group} position={[0, 0, -5]}>
            <Lasagna position={[-4, 2, -2]} onCatch={() => { }} onMiss={() => { }} />
            <Lasagna position={[4, -1, 1]} onCatch={() => { }} onMiss={() => { }} />
            <Lasagna position={[0, 4, -4]} onCatch={() => { }} onMiss={() => { }} />
        </group>
    )
}

const GameScene: React.FC<GameSceneProps> = ({ gameState, score, onScore, onGameOver }) => {
    const isPlaying = gameState === 'playing';

    return (
        <Physics gravity={[0, -9.81, 0]}>
            {/* Background Decor when not playing */}
            {!isPlaying && <FloatingDecor />}

            {/* Ground Plane */}
            {isPlaying && (
                <group position={[0, -6, 0]}>
                    <RigidBody type="fixed">
                        <mesh receiveShadow>
                            <boxGeometry args={[30, 1, 30]} />
                            <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
                        </mesh>
                    </RigidBody>
                    <Grid
                        position={[0, 0.51, 0]}
                        args={[30, 30]}
                        cellSize={1}
                        cellThickness={1}
                        cellColor="#1b4332"
                        sectionSize={3}
                        sectionThickness={1.5}
                        sectionColor="#081c15"
                        fadeDistance={30}
                        fadeStrength={1}
                    />
                </group>
            )}

            {/* Game elements */}
            <Catcher isPlaying={isPlaying} score={score} />
            <GameLogic
                isPlaying={isPlaying}
                onScore={onScore}
                onGameOver={onGameOver}
            />
        </Physics>
    );
};

export default GameScene;

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';

interface LasagnaProps {
    position: [number, number, number];
    onCatch: () => void;
    onMiss: () => void;
}

const Lasagna: React.FC<LasagnaProps> = ({ position, onCatch, onMiss }) => {
    const rigidBodyGlobal = useRef<RapierRigidBody>(null);
    const hasTriggered = useRef(false);

    // Randomize rotation for visual interest
    const initialRotation = useMemo(() => [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
    ] as [number, number, number], []);

    useFrame(() => {
        if (!rigidBodyGlobal.current || hasTriggered.current) return;

        const pos = rigidBodyGlobal.current.translation();

        // If it falls below the screen, trigger a miss
        if (pos.y < -10) {
            hasTriggered.current = true;
            onMiss();
        }
    });

    return (
        <RigidBody
            ref={rigidBodyGlobal}
            position={position}
            rotation={initialRotation}
            colliders="cuboid"
            restitution={0.5} // bouncy
            friction={1}
            // Notify when it intersects with the catcher
            onIntersectionEnter={({ other }) => {
                if (other.rigidBodyObject?.name === 'catcher' && !hasTriggered.current) {
                    hasTriggered.current = true;
                    onCatch();

                    // Move out of sight immediately
                    if (rigidBodyGlobal.current) {
                        rigidBodyGlobal.current.setTranslation({ x: 0, y: -20, z: 0 }, true);
                    }
                }
            }}
        >
            <group scale={1.5}>
                {/* Pasta layer */}
                <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1, 0.1, 1]} />
                    <meshStandardMaterial color="#f4d03f" roughness={0.3} />
                </mesh>
                {/* Meat/Sauce layer */}
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.9, 0.2, 0.9]} />
                    <meshStandardMaterial color="#e63946" roughness={0.6} />
                </mesh>
                {/* Cheese layer */}
                <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.95, 0.1, 0.95]} />
                    <meshStandardMaterial color="#ffea00" roughness={0.1} metalness={0.1} />
                </mesh>
            </group>
        </RigidBody>
    );
};

export default Lasagna;

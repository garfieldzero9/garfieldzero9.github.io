import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';

interface CatcherProps {
    isPlaying: boolean;
    score: number;
}

const Catcher: React.FC<CatcherProps> = ({ isPlaying, score }) => {
    const rigidBodyRef = useRef<RapierRigidBody>(null);
    const groupRef = useRef<THREE.Group>(null);
    const prevScore = useRef(score);

    useFrame((state) => {
        if (!isPlaying || !rigidBodyRef.current) return;

        // Follow mouse X, but keep Y and Z locked
        const viewportWidth = state.viewport.width;
        // Un-normalize mouse coordinate (-1 to 1) to viewport units
        const targetX = (state.pointer.x * viewportWidth) / 2;

        // Lerp for smooth movement
        const currentTranslation = rigidBodyRef.current.translation();
        const newX = currentTranslation.x + (targetX - currentTranslation.x) * 0.2;

        rigidBodyRef.current.setNextKinematicTranslation({
            x: newX,
            y: -5, // Locked to bottom of screen
            z: 0
        });

        // Animation logic for catching
        if (groupRef.current) {
            if (score > prevScore.current) {
                // Trigger a bounce/squish scale effect
                groupRef.current.scale.set(1.4, 0.6, 1.4);
                prevScore.current = score;
            }
            // Lerp scale back to normal
            groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);

            // Add a slight wiggle based on movement
            const tilt = (targetX - currentTranslation.x) * 0.05;
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -tilt, 0.2);
        }
    });

    return (
        <RigidBody
            ref={rigidBodyRef}
            type="kinematicPosition"
            position={[0, -5, 0]}
            name="catcher"
            colliders={false}
        >
            <CylinderCollider args={[0.5, 1.5]} sensor />
            <group ref={groupRef} position={[0, -0.25, 0]}>
                {/* Cat Body */}
                <mesh castShadow receiveShadow position={[0, 0, 0]}>
                    <boxGeometry args={[2, 1, 1]} />
                    <meshStandardMaterial color="#fb8b24" roughness={0.4} />
                </mesh>

                {/* Cat Head */}
                <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
                    <boxGeometry args={[1.2, 1, 1.2]} />
                    <meshStandardMaterial color="#fb8b24" roughness={0.4} />
                </mesh>

                {/* Ears */}
                <mesh castShadow receiveShadow position={[-0.4, 1.3, 0]}>
                    <boxGeometry args={[0.3, 0.4, 0.3]} />
                    <meshStandardMaterial color="#fb8b24" roughness={0.4} />
                </mesh>
                <mesh castShadow receiveShadow position={[0.4, 1.3, 0]}>
                    <boxGeometry args={[0.3, 0.4, 0.3]} />
                    <meshStandardMaterial color="#fb8b24" roughness={0.4} />
                </mesh>

                {/* Eyes */}
                <group position={[0, 0.8, 0.61]}>
                    <mesh position={[-0.25, 0, 0]}>
                        <boxGeometry args={[0.2, 0.2, 0.05]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[0.25, 0, 0]}>
                        <boxGeometry args={[0.2, 0.2, 0.05]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[-0.25, 0, 0.03]}>
                        <boxGeometry args={[0.1, 0.1, 0.05]} />
                        <meshBasicMaterial color="#000000" />
                    </mesh>
                    <mesh position={[0.25, 0, 0.03]}>
                        <boxGeometry args={[0.1, 0.1, 0.05]} />
                        <meshBasicMaterial color="#000000" />
                    </mesh>
                </group>

                {/* Nose/Mouth */}
                <mesh castShadow receiveShadow position={[0, 0.5, 0.65]}>
                    <boxGeometry args={[0.4, 0.2, 0.1]} />
                    <meshStandardMaterial color="#ffb067" />
                </mesh>
            </group>
        </RigidBody>
    );
};

export default Catcher;

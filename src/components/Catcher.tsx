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
    const keys = useRef({ left: false, right: false, space: false });
    const targetXRef = useRef(0);
    const lastMouseX = useRef(0);
    const jumpVelocity = useRef(0);
    const isJumping = useRef(false);
    const currentY = useRef(-5);

    React.useEffect(() => {
        if (isPlaying) {
            currentY.current = -5;
            jumpVelocity.current = 0;
            isJumping.current = false;
        }
    }, [isPlaying]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = true;
            if (e.key === ' ' || e.key === 'Spacebar') keys.current.space = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = false;
            if (e.key === ' ' || e.key === 'Spacebar') keys.current.space = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (!isPlaying || !rigidBodyRef.current) return;

        // Hybrid controls: Follow mouse X if it moves, else use keyboard
        const viewportWidth = state.viewport.width;
        const currentMouseX = (state.pointer.x * viewportWidth) / 2;

        // If mouse moved significantly, update target to mouse position
        if (Math.abs(currentMouseX - lastMouseX.current) > 0.05) {
            targetXRef.current = currentMouseX;
            lastMouseX.current = currentMouseX;
        }

        const speed = 25; // Units per second for keyboard
        if (keys.current.left) targetXRef.current -= speed * delta;
        if (keys.current.right) targetXRef.current += speed * delta;

        // Jump logic
        const gravity = -40;
        const jumpStrength = 15;
        const groundY = -5;

        if (keys.current.space && !isJumping.current) {
            jumpVelocity.current = jumpStrength;
            isJumping.current = true;
        }

        if (isJumping.current) {
            jumpVelocity.current += gravity * delta;
            currentY.current += jumpVelocity.current * delta;

            if (currentY.current <= groundY) {
                currentY.current = groundY;
                jumpVelocity.current = 0;
                isJumping.current = false;
                
                // Land squish effect
                if (groupRef.current) {
                    groupRef.current.scale.set(1.3, 0.7, 1.3);
                }
            }
        }

        // Clamp to screen
        const bounds = (viewportWidth / 2) - 1.5;
        targetXRef.current = THREE.MathUtils.clamp(targetXRef.current, -bounds, bounds);

        const targetX = targetXRef.current;

        // Lerp for smooth movement
        const currentTranslation = rigidBodyRef.current.translation();
        const newX = currentTranslation.x + (targetX - currentTranslation.x) * 0.2;

        rigidBodyRef.current.setNextKinematicTranslation({
            x: newX,
            y: currentY.current,
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

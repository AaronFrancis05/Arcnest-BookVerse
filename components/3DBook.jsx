// components/3DBook.jsx
'use client';
import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import BookPages from '@/components/BookPages';

export default function ThreeDBook({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    coverColor = '#4f46e5',
    animate = true,
    isOpen = false,
    size = 1.5
}) {
    const meshRef = useRef();
    const starsRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [bookOpen, setBookOpen] = useState(isOpen);
    const { scene } = useThree();

    // Set universe background
    useMemo(() => {
        // Create a deep space background
        scene.background = new THREE.Color(0x000011);

        // Add fog for depth
        scene.fog = new THREE.FogExp2(0x000022, 0.02);
    }, [scene]);

    // Scale all dimensions by the size prop
    const scaleFactor = size;
    const bookWidth = 0.8 * scaleFactor;
    const bookHeight = 1.1 * scaleFactor;
    const bookDepth = 0.6 * scaleFactor;
    const coverThickness = 0.04 * scaleFactor;
    const spineThickness = 0.08 * scaleFactor;

    // Spring animations for open/close
    const { leftCoverRotation, rightCoverRotation, bookPosition, bookScale } = useSpring({
        leftCoverRotation: bookOpen ? Math.PI / 2.2 : 0.1,
        rightCoverRotation: bookOpen ? -Math.PI / 2.2 : -0.1,
        bookPosition: bookOpen ? [0, 0.3, 0] : [0, 0, 0],
        bookScale: hovered && !bookOpen ? 1.15 : 1,
        config: {
            mass: 1,
            tension: 280,
            friction: 60
        }
    });

    // Create moving stars with velocities
    const { starData, initialPositions } = useMemo(() => {
        const starCount = 3000;
        const positions = new Float32Array(starCount * 3);
        const velocities = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            // Random positions in a large sphere around the scene
            const radius = 15 + Math.random() * 35;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Random velocities for movement
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

            // Star colors - mostly white/blue with some variation 
            const colorVariation = Math.random() * 0.3;
            const starColor = Math.random() > 0.8 ?
                [0.7 + colorVariation, 0.8 + colorVariation, 1.0] : // Blue stars
                [0.9 + colorVariation, 0.9 + colorVariation, 1.0];  // White stars

            colors[i * 3] = starColor[0];
            colors[i * 3 + 1] = starColor[1];
            colors[i * 3 + 2] = starColor[2];

            // Random sizes
            sizes[i] = 0.02 + Math.random() * 0.08;
        }

        return {
            starData: { positions, velocities, colors, sizes },
            initialPositions: positions.slice()
        };
    }, []);

    // Reference to store current star positions and velocities
    const starsAttributesRef = useRef({
        positions: starData.positions.slice(),
        velocities: starData.velocities.slice()
    });

    // Floating animation when closed and star movement
    useFrame((state) => {
        if (!animate) return;

        const time = state.clock.elapsedTime;

        // Book animation
        if (!bookOpen) {
            meshRef.current.rotation.y = Math.sin(time) * 0.1;
            meshRef.current.position.y = Math.sin(time * 0.8) * 0.1 * scaleFactor;

            if (hovered) {
                meshRef.current.rotation.z = Math.sin(time * 2) * 0.05;
            }
        }

        // Animate stars with random movement
        if (starsRef.current) {
            const stars = starsRef.current;
            const positions = starsAttributesRef.current.positions;
            const velocities = starsAttributesRef.current.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                // Update positions with velocity
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];

                // Boundary check - reset stars that move too far 
                const maxDistance = 50;
                if (Math.abs(positions[i * 3]) > maxDistance ||
                    Math.abs(positions[i * 3 + 1]) > maxDistance ||
                    Math.abs(positions[i * 3 + 2]) > maxDistance) {

                    // Reset to new random position near the center
                    const newRadius = 15 + Math.random() * 10;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);

                    positions[i * 3] = newRadius * Math.sin(phi) * Math.cos(theta);
                    positions[i * 3 + 1] = newRadius * Math.sin(phi) * Math.sin(theta);
                    positions[i * 3 + 2] = newRadius * Math.cos(phi);

                    // Reset velocity with some variation
                    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
                    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
                    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
                }
            }

            // Update the geometry
            stars.geometry.attributes.position.array.set(positions);
            stars.geometry.attributes.position.needsUpdate = true;

            // Subtle overall rotation for universe effect
            stars.rotation.y = time * 0.005;
            stars.rotation.x = Math.sin(time * 0.003) * 0.1;
        }
    });

    const handleClick = () => {
        setBookOpen(!bookOpen);
    };

    return (
        <>
            {/* Moving Stars */}
            <points ref={starsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={starData.positions.length / 3}
                        array={starsAttributesRef.current.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={starData.colors.length / 3}
                        array={starData.colors}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-size"
                        count={starData.sizes.length}
                        array={starData.sizes}
                        itemSize={1}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.1}
                    sizeAttenuation={true}
                    vertexColors={true}
                    transparent={true}
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Nebula Clouds */}
            <mesh position={[10, 5, -15]} rotation={[0, 0.5, 0]}>
                <sphereGeometry args={[8, 32, 32]} />
                <meshBasicMaterial
                    color={0x4466ff}
                    transparent={true}
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>

            <mesh position={[-12, -3, -20]} rotation={[0, -0.3, 0]}>
                <sphereGeometry args={[12, 32, 32]} />
                <meshBasicMaterial
                    color={0x8844ff}
                    transparent={true}
                    opacity={0.08}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Main Book */}
            <a.group
                ref={meshRef}
                position={bookPosition}
                rotation={rotation}
                scale={bookScale}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={handleClick}
            >
                <group scale={[scaleFactor, scaleFactor, scaleFactor]}>

                    {/* Book Spine */}
                    <mesh position={[0, 0, -bookDepth / 2 + spineThickness / 2]}>
                        <boxGeometry args={[bookWidth, bookHeight, spineThickness]} />
                        <meshStandardMaterial
                            color={coverColor}
                            roughness={0.3}
                            metalness={0.2}
                            emissive="#1e1b4b"
                            emissiveIntensity={0.5}
                        />
                    </mesh>

                    {/* Back Cover (Left) */}
                    <a.mesh
                        position={[-bookWidth / 2 + coverThickness / 2, 0, 0]}
                        rotation-y={leftCoverRotation}
                    >
                        <boxGeometry args={[coverThickness, bookHeight, bookDepth]} />
                        <meshStandardMaterial
                            color={coverColor}
                            roughness={0.4}
                            metalness={0.3}
                            emissive="#1e1b4b"
                            emissiveIntensity={0.4}
                        />
                    </a.mesh>

                    {/* Front Cover (Right) */}
                    <a.mesh
                        position={[bookWidth / 2 - coverThickness / 2, 0, 0]}
                        rotation-y={rightCoverRotation}
                    >
                        <boxGeometry args={[coverThickness, bookHeight, bookDepth]} />
                        <meshStandardMaterial
                            color={coverColor}
                            roughness={0.4}
                            metalness={0.3}
                            emissive="#1e1b4b"
                            emissiveIntensity={0.4}
                        />

                        {/* Cover Title */}
                        {!bookOpen && (
                            <Text
                                position={[0.1, 0, bookDepth / 2 + 0.01]}
                                rotation={[0, Math.PI / 2, 0]}
                                fontSize={0.15}
                                color="white"
                                anchorX="center"
                                anchorY="middle"
                            >
                            
                            </Text>
                        )}
                    </a.mesh>

                    {/* Pages Block */}
                    <mesh position={[0, 0, 0.01]}>
                        <boxGeometry args={[
                            bookWidth - coverThickness * 2 - 0.02,
                            bookHeight - 0.04,
                            bookDepth - 0.05
                        ]} />
                        <meshStandardMaterial
                            color="#f8f6f0"
                            roughness={0.9}
                            metalness={0.1}
                        />
                    </mesh>

                    {/* Page Content when Open */}
                    {bookOpen && (
                        <BookPages
                            bookWidth={bookWidth}
                            bookHeight={bookHeight}
                            bookDepth={bookDepth}
                            coverThickness={coverThickness}
                        />
                    )}

                </group>
            </a.group>
        </>
    );
}
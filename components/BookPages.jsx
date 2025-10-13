// components/BookPages.jsx
'use client';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
 function BookPage({ content, position, rotation, isLeft = false }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Page */}
            <mesh>
                <planeGeometry args={[0.7, 0.9]} />
                <meshStandardMaterial color="#fefefe" />
            </mesh>

            {/* Page Content */}
            <Text
                position={[0, 0, 0.01]}
                fontSize={0.06}
                color="#333"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.65}
                textAlign="center"
            >
                {content}
            </Text>

            {/* Page Edge */}
            <mesh position={[isLeft ? -0.35 : 0.35, 0, 0.001]}>
                <boxGeometry args={[0.02, 0.9, 0.002]} />
                <meshStandardMaterial color="#e0d8c8" />
            </mesh>
        </group>
    );
}

export default function BookPages({ bookWidth, bookHeight, bookDepth, coverThickness }) {
    const pagesRef = useRef();
    const [currentPage, setCurrentPage] = useState(0);

    // Sample book content
    const pages = [
        "Welcome to the\n3D Book!\n\nClick to turn pages...",
        "Chapter 1\n\nThe Beginning\n\nOnce upon a time...",
        "In a world of\n3D graphics...\n\nMagic happens!",
        "The End\n\nThanks for\nreading!",
    ];

    const { pageRotation } = useSpring({
        pageRotation: [0, currentPage * 0.1, 0],
        config: { mass: 1, tension: 180, friction: 12 }
    });

    useFrame((state) => {
        if (pagesRef.current) {
            pagesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
        }
    });

    const handlePageTurn = () => {
        setCurrentPage((prev) => (prev + 1) % pages.length);
    };

    return (
        <group ref={pagesRef} onClick={(e) => { e.stopPropagation(); handlePageTurn(); }}>

            {/* Left Page */}
            <BookPage
                content={pages[currentPage]}
                position={[-0.2, 0, bookDepth / 2 - 0.1]}
                rotation={[0, Math.PI / 2, 0]}
                isLeft={true}
            />

            {/* Right Page */}
            <BookPage
                content={pages[(currentPage + 1) % pages.length]}
                position={[0.2, 0, bookDepth / 2 - 0.1]}
                rotation={[0, Math.PI / 2, 0]}
                isLeft={false}
            />

            {/* Interactive Page Turn Hint */}
            <Text
                position={[0.4, -0.4, bookDepth / 2 - 0.08]}
                rotation={[0, Math.PI / 2, 0]}
                fontSize={0.04}
                color="#666"
                anchorX="center"
            >
                Click to turn page
            </Text>
        </group>
    );
}
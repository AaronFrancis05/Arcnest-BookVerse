// components/BookScene.jsx
'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ThreeDBook from './3DBook';

export default function BookScene({ className = "" }) {
    return (
        <div className={`w-full ${className}`} style={{ height: '66vh' }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                shadows
            >
                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <pointLight position={[-5, -5, -5]} intensity={0.5} />

                {/* Controls */}
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={3}
                    maxDistance={10}
                />

                {/* Environment */}
                <Environment preset="city" />

                {/* Book */}
                <ThreeDBook
                    position={[0, 0, 0]}
                    coverColor="#4f46e5"
                    size={1.2} // Slightly smaller to fit better
                />
            </Canvas>
        </div>
    );
}
// 'use client'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { useRef } from 'react'

// function RotatingCube() {
//     const meshRef = useRef(null) // Remove TypeScript generic

//     useFrame(() => {
//         if (meshRef.current) {
//             meshRef.current.rotation.x += 0.01
//             meshRef.current.rotation.y += 0.01
//         }
//     })

//     return (
//         <mesh ref={meshRef}>
//             <boxGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
//         </mesh>
//     )
// }

// export default function ThreeDSkeletonLoader() {
//     return (
//         <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
//             <Canvas>
//                 <ambientLight intensity={0.5} />
//                 <pointLight position={[10, 10, 10]} />
//                 <RotatingCube />
//             </Canvas>
//             <div className="absolute bottom-4 text-center">
//                 <p className="text-gray-600 font-medium">Loading awesome content...</p>
//             </div>
//         </div>
//     )
// }
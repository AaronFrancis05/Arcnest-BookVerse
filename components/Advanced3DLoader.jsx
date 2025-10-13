// // components/Advanced3DLoader.jsx
// 'use client';
// import { useRef, useState, useMemo, Suspense } from 'react';
// import { useFrame, useThree } from '@react-three/fiber';
// import { Text, Html, useProgress, useGLTF, OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';

// // Main 3D Loader Componegit commit -m "first commit"nt
// function ThreeDLoader({ progress = 0, message = "Loading..." }) {
//     const groupRef = useRef();
//     const particlesRef = useRef();
//     const { viewport } = useThree();

//     // Particle system for background
//     const particles = useMemo(() => {
//         const count = 500;
//         const positions = new Float32Array(count * 3);
//         const colors = new Float32Array(count * 3);

//         for (let i = 0; i < count; i++) {
//             positions[i * 3] = (Math.random() - 0.5) * 20;
//             positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
//             positions[i * 3 + 2] = (Math.random() - 0.
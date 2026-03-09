"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedOrb() {
    const orbRef = useRef<any>(null);

    useFrame((state) => {
        if (orbRef.current) {
            orbRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            orbRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Sphere ref={orbRef} visible args={[1, 100, 200]} scale={2}>
            <MeshDistortMaterial
                color="#8B5CF6"
                attach="material"
                distort={0.5}
                speed={2}
                roughness={0.2}
                metalness={0.8}
                emissive="#4C1D95"
                emissiveIntensity={0.5}
            />
        </Sphere>
    );
}

export default function ThreeJSOrb() {
    return (
        <div className="w-full h-[400px] md:h-[500px] relative pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={1} />
                <directionalLight position={[2, 2, 2]} intensity={2} color="#ffffff" />
                <AnimatedOrb />
            </Canvas>
        </div>
    );
}

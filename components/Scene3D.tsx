import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus, Icosahedron, MeshDistortMaterial, Stars, Float, Box } from '@react-three/drei';
import * as THREE from 'three';

const AvatarCore = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (coreRef.current) {
      // Core palpitates and rotates
      coreRef.current.rotation.y = t * 0.5;
      coreRef.current.rotation.z = t * 0.2;
    }

    if (ring1Ref.current) {
        ring1Ref.current.rotation.x = Math.sin(t * 0.5) * 2;
        ring1Ref.current.rotation.y = Math.cos(t * 0.3) * 2;
    }
    
    if (ring2Ref.current) {
        ring2Ref.current.rotation.x = Math.cos(t * 0.4) * 2;
        ring2Ref.current.rotation.y = Math.sin(t * 0.2) * 2;
    }

    if (ring3Ref.current) {
        ring3Ref.current.rotation.x = Math.sin(t * 0.3) * 2;
        ring3Ref.current.rotation.z = Math.cos(t * 0.5) * 2;
    }
  });

  return (
    <group ref={groupRef} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
      {/* Central Core - The "Brain" */}
      <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
        <Icosahedron args={[1, 0]} ref={coreRef}>
            <MeshDistortMaterial
            color={hovered ? "#ec4899" : "#06b6d4"}
            attach="material"
            distort={0.5}
            speed={4}
            roughness={0.1}
            metalness={0.9}
            emissive={hovered ? "#ec4899" : "#06b6d4"}
            emissiveIntensity={0.5}
            />
        </Icosahedron>
      </Float>

      {/* Gyroscopic Rings representing different tech stacks */}
      <Torus args={[1.6, 0.02, 16, 100]} ref={ring1Ref}>
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} emissive="#8b5cf6" emissiveIntensity={0.2} />
      </Torus>
      
      <Torus args={[2.0, 0.02, 16, 100]} ref={ring2Ref}>
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} emissive="#3b82f6" emissiveIntensity={0.2} />
      </Torus>

      <Torus args={[2.4, 0.02, 16, 100]} ref={ring3Ref}>
        <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.2} emissive="#06b6d4" emissiveIntensity={0.2} />
      </Torus>

      {/* Floating Data Cubes */}
      <group>
        {[...Array(6)].map((_, i) => (
             <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2} position={[
                 Math.sin(i * Math.PI / 3) * 3, 
                 Math.cos(i * Math.PI / 3) * 3, 
                 0
             ]}>
                <Box args={[0.2, 0.2, 0.2]}>
                    <meshStandardMaterial color="white" wireframe />
                </Box>
             </Float>
        ))}
      </group>
    </group>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-[50vh] md:h-[600px] cursor-move relative z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ec4899" />
        <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={2} color="#06b6d4" />
        
        <AvatarCore />
        
        {/* Background Atmosphere */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* Interactive Controls */}
        <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            autoRotate={true} 
            autoRotateSpeed={1}
            minDistance={3}
            maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;
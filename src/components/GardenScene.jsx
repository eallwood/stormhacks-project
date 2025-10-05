import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";

const soilColors = {
  sandy: '#C2B280', // Sand
  clay: '#B76E55',   // Terracotta/clay
  loamy: '#654321',  // Dark rich brown
  silty: '#9E9E9E',  // Grayish brown
  peaty: '#3B2F2F',  // Very dark brown/black
  chalky: '#EAEAEA', // Light gray/white
};

function Tile({ position, texture, soilType }) {
  const groundColor = soilColors[soilType] || '#4CAF50'; // Default to green

  return (
    <group position={position}>
      {/* Ground tile */}
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color={groundColor} />
      </mesh>

      {/* Crossed plant */}
      <group position={[0, 0.5, 0]}>
        {/* Plane 1 */}
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            side={2}
          />
        </mesh>

        {/* Plane 2 at 90° */}
        <mesh rotation-y={Math.PI / 2}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            side={2}
          />
        </mesh>
      </group>
    </group>
  );
}

function GardenGrid({ width = 8, height = 8, soilType }) {
  const texture = useTexture("/src/img/Tall_Grass.webp");

  // Generate grid positions
  const positions = useMemo(() => {
    const pos = [];
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < height; z++) {
        pos.push([x - width / 2, 0, z - height / 2]);
      }
    }
    return pos;
  }, [width, height]);

  return (
    <>
      {positions.map((pos, i) => (
        <Tile key={i} position={pos} texture={texture} soilType={soilType} />
      ))}
    </>
  );
}

export default function GardenScene({ width, height, soilType }) {
  return (
    <div className="w-full h-screen bg-white">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={4} />
        <directionalLight position={[10, 10, 5]} intensity={3} />
        <GardenGrid width={width} height={height} soilType={soilType} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
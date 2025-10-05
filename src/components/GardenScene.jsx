import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";

const soilColors = {
  sandy: '#C2B280', // Sand
  clay: '#B76E55',   // Terracotta/clay
  loamy: '#654321',  // Dark rich brown
  silty: '#9E9E9E',  // Grayish brown
  peaty: '#3B2F2F',  // Very dark brown/black
  chalky: '#EAEAEA', // Light gray/white
};

const lightingConfig = {
  // Light presets
  full: { ambient: 4, directional: 3 },
  partial: { ambient: 3, directional: 2 },
  shade: { ambient: 2, directional: 1 },
  // Exposure modifiers
  outside: { position: [10, 10, 5], intensityFactor: 1.0 },
  sheltered: { position: [0, 5, -5], intensityFactor: 0.7 },
};

const getLightSettings = (light, exposure) => {
  const lightPreset = lightingConfig[light] || lightingConfig.full;
  const exposurePreset = lightingConfig[exposure] || lightingConfig.outside;

  const ambientIntensity = lightPreset.ambient;
  const directionalIntensity = lightPreset.directional * exposurePreset.intensityFactor;
  const directionalPosition = exposurePreset.position;

  return { ambientIntensity, directionalIntensity, directionalPosition };
}

const plantImageMap = {
  'Wild Rose (Rosa acicularis)': '/src/img/WildRose.png',
  'Red Columbine (Aquilegia formosa)': '/src/img/RedColumbine.png',
  'Sword Fern (Polystichum munitum)': '/src/img/SwordFern.png',
  'Kinnikinnick (Arctostaphylos uva-ursi)': '/src/img/Kinnick.png',
  'Oregon Grape (Mahonia aquifolium)': '/src/img/Tall_Grass.webp',
  'Salmonberry (Rubus spectabilis)': '/src/img/SalmonBerry.png',
  'Douglas Aster (Symphyotrichum subspicatum)': '/src/img/Tall_Grass.webp',
  'Western Trillium (Trillium ovatum)': '/src/img/Trillium.png',
  'Nootka Rose (Rosa nutkana)': '/src/img/Tall_Grass.webp',
  'Pacific Bleeding Heart (Dicentra formosa)': '/src/img/Tall_Grass.webp',
  'Mock Orange (Philadelphus lewisii)': '/src/img/Tall_Grass.webp',
  'Snowberry (Symphoricarpos albus)': '/src/img/Tall_Grass.webp',
  'Yarrow (Achillea millefolium)': '/src/img/Yarrow.png',
  'Evergreen Huckleberry (Vaccinium ovatum)': '/src/img/Tall_Grass.webp',
  'Lupine (Lupinus polyphyllus)': '/src/img/Tall_Grass.webp',
  'Red Flowering Currant (Ribes sanguineum)': '/src/img/Tall_Grass.webp',
  'Bleeding Heart Vine (Clerodendrum thomsoniae)': '/src/img/Tall_Grass.webp',
  'Ferns (Athyrium filix-femina)': '/src/img/Fern.png',
  'Camassia (Camassia quamash)': '/src/img/Tall_Grass.webp',
  'Vanilla Leaf (Achlys triphylla)': '/src/img/VanillaLeaf.png',
  'Indian Plum (Oemleria cerasiformis)': '/src/img/Tall_Grass.webp',
  'Twinflower (Linnaea borealis)': '/src/img/Tall_Grass.webp',
  'Fireweed (Chamerion angustifolium)': '/src/img/FireWeed.png',
  'Pacific Rhododendron (Rhododendron macrophyllum)': '/src/img/PacificRhododendron.png',
  'Licorice Fern (Polypodium glycyrrhiza)': '/src/img/Tall_Grass.webp',
  'Coastal Strawberry (Fragaria chiloensis)': '/src/img/Tall_Grass.webp',
  'Inside-Out Flower (Vancouveria hexandra)': '/src/img/InsideOutFlower.png',
  'Ocean Spray (Holodiscus discolor)': '/src/img/Tall_Grass.webp',
  'default': '/src/img/Tall_Grass.webp',
};

function Tile({ position, soilType, plantName, randomRotation, isSelected }) {
  const groundColor = soilColors[soilType] || '#4CAF50'; // Default to green
  const texture = useTexture(plantImageMap[plantName] || plantImageMap['default']);
  const plantRef = useRef();
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef(0);

  // This effect triggers the animation when a plant is assigned to the tile.
  useEffect(() => {
    if (plantName) {
      // Reset and start animation
      startTimeRef.current = 0; // Will be set on the first animation frame
      setIsAnimating(true);
      if (plantRef.current) {
        plantRef.current.scale.set(0, 0, 0); // Ensure it starts from scale 0
      }
    }
  }, [plantName]);

  // Calculate a delay based on the tile's position to create a wave effect.
  // The wave will move diagonally across the grid.
  const waveDelay = (position[0] + position[2]) * 100; // in milliseconds

  useFrame(({ clock }) => {
    if (!plantRef.current) return;

    // Growth animation
    if (isAnimating) {
      if (startTimeRef.current === 0) {
        startTimeRef.current = clock.elapsedTime * 1000; // Get start time in ms
      }

      const elapsedTime = clock.elapsedTime * 1000 - startTimeRef.current;
      const animationDuration = 500; // ms

      if (elapsedTime > waveDelay) {
        const progress = Math.min((elapsedTime - waveDelay) / animationDuration, 1);
        const scale = progress;
        plantRef.current.scale.set(scale, scale, scale);

        if (progress >= 1) {
          setIsAnimating(false); // Stop the growth animation once complete
        }
      }
    } else {
      // Swaying animation (runs after growth)
      const t = clock.getElapsedTime();
      const swayFrequency = 0.7;
      const swayAmplitude = 0.08;
      plantRef.current.rotation.z = Math.sin(t * swayFrequency + randomRotation) * swayAmplitude;
      plantRef.current.rotation.x = Math.cos(t * swayFrequency * 0.7 + randomRotation) * swayAmplitude * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Ground tile */}
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial color={groundColor} />
      </mesh>

      {/* Crossed plant - only rendered if a plantName exists */}
      {plantName && (
        <group ref={plantRef} position={[0, 0, 0]} rotation-y={randomRotation} scale={0}>
        {/* Plane 1 */}
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            side={2}
          />
        </mesh>

        {/* Plane 2 at 90° */}
        <mesh position={[0, 0.5, 0]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            side={2}
          />
        </mesh>
        </group>
      )}
    </group>
  );
}

function GardenGrid({ width = 8, height = 8, soilType, recommendedPlants, selectedPlantName }) {
  // Generate grid positions and assign plants
  const positions = useMemo(() => {
    const pos = [];
    const tileScale = 0.5;
    const totalTiles = (width / tileScale) * (height / tileScale);
    const plantsToDistribute = [];

    if (recommendedPlants && recommendedPlants.length > 0) {
      // Create an evenly distributed list of plants to fill the grid
      for (let i = 0; i < totalTiles; i++) {
        plantsToDistribute.push(recommendedPlants[i % recommendedPlants.length]);
      }
      // Shuffle the list for a random appearance
      for (let i = plantsToDistribute.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [plantsToDistribute[i], plantsToDistribute[j]] = [plantsToDistribute[j], plantsToDistribute[i]];
      }
    }

    for (let x = 0; x < width / tileScale; x++) {
      for (let z = 0; z < height / tileScale; z++) {
        const plantName = plantsToDistribute.pop() || null;
        pos.push({
          position: [x * tileScale - width / 2, 0, z * tileScale - height / 2],
          plantName: plantName,
          // Add a random rotation for each tile
          randomRotation: Math.random() * Math.PI,
        });
      }
    }
    return pos;
  }, [width, height, recommendedPlants]);

  return (
    <>
      {positions.map((tileData, i) => (
        <Tile
          key={i}
          position={tileData.position}
          soilType={soilType}
          plantName={tileData.plantName}
          randomRotation={tileData.randomRotation}
          isSelected={tileData.plantName === selectedPlantName}
        />
      ))}
    </>
  );
}

export default function GardenScene({ width, height, soilType, light, exposure, recommendedPlants, selectedPlantName }) {
  const { ambientIntensity, directionalIntensity, directionalPosition } = getLightSettings(light, exposure);
  const tileScale = 0.5;

  // Calculate the true center of the grid for the camera to pivot around
  const gridCenter = useMemo(() => [((width / tileScale) % 2 === 0 ? -tileScale / 2 : 0), 0, ((height / tileScale) % 2 === 0 ? -tileScale / 2 : 0)], [width, height]);

  return (
    <div className="w-full h-screen bg-[#F9FBE7]">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={directionalPosition} intensity={directionalIntensity} />
        <GardenGrid
          width={width}
          height={height}
          soilType={soilType}
          recommendedPlants={recommendedPlants}
          selectedPlantName={selectedPlantName}
        />
        <OrbitControls
          target={gridCenter}
          minPolarAngle={Math.PI / 6} // 30 degrees from vertical
          maxPolarAngle={4 * Math.PI / 9} // 80 degrees from vertical
        />
      </Canvas>
    </div>
  );
}
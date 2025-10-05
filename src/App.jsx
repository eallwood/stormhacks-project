import { useState, useMemo } from 'react'
import './index.css';
import DialogueBox from './components/DialogueBox';
import GardenScene from './components/GardenScene';
import PlantSelector from './components/PlantSelector';
import PlantInfoDisplay from './components/PlantInfoDisplay';
import ViewToggle from './components/ViewToggle';
import ChatInterface from './components/ChatInterface';
import CarbonInfoBox from './components/CarbonInfoBox';
 
function App() {
  const [gardenData, setGardenData] = useState({
    width: 8,
    height: 8,
    location: 'vancouver',
    light: 'full',
    exposure: 'outside',
    soilType: 'sandy',
  });
  const [recommendedPlants, setRecommendedPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [carbonOffset, setCarbonOffset] = useState(null);
  const [activeView, setActiveView] = useState('planner');

  const handleSetRecommendations = (data) => {
    const plants = data?.recommendations || [];
    setRecommendedPlants(plants);
    setCarbonOffset(data?.carbonOffset || null);
    if (plants && plants.length > 0) {
      setSelectedPlant(plants[0]); // Select the first plant by default
    } else {
      setSelectedPlant(null);
    }
  };

  const plantNames = useMemo(() => recommendedPlants.map(p => p.name), [recommendedPlants]);

  return (
    <div className="App overflow-hidden">
      <GardenScene
        width={gardenData.width}
        height={gardenData.height}
        soilType={gardenData.soilType}
        light={gardenData.light}
        exposure={gardenData.exposure}
        recommendedPlants={plantNames}
        selectedPlantName={selectedPlant?.name}
      />
      <h1 className='font-[Pressura] text-4xl font-normal absolute top-4 left-[50%] -translate-x-[50%]'>Stormhacks Project</h1>

      {recommendedPlants.length > 0 && (
        <ViewToggle activeView={activeView} setActiveView={setActiveView} />
      )}

      {/* This container will now slide to the left */}
      <div className={`transition-transform duration-500 ease-in-out ${activeView === 'carbon' ? '-translate-x-full' : 'translate-x-0'}`}>
        <PlantSelector
          plants={recommendedPlants}
          selectedPlant={selectedPlant}
          onPlantSelect={setSelectedPlant}
        />
        <PlantInfoDisplay plant={selectedPlant} />
      </div>

      {/* This container will slide to the right */}
      <div className={`transition-transform duration-500 ease-in-out ${activeView === 'carbon' ? 'translate-x-full' : 'translate-x-0'}`}>
        <DialogueBox
          gardenData={gardenData}
          setGardenData={setGardenData}
          setRecommendedPlants={handleSetRecommendations}
        />
      </div>

      <div className={`transition-transform duration-500 ease-in-out fixed top-5 right-5 bottom-5 ${activeView === 'carbon' ? 'translate-y-0' : '-translate-y-[120%]'}`}>
        <ChatInterface recommendedPlants={recommendedPlants} />
      </div>

      <div className={`transition-transform duration-500 ease-in-out fixed bottom-5 left-5 ${activeView === 'carbon' ? 'translate-y-0' : 'translate-y-[150%]'}`}>
        <CarbonInfoBox offsetData={carbonOffset} />
      </div>
    </div>
  )
}

export default App

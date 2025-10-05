import { useState } from 'react'
import './index.css';
import DialogueBox from './components/DialogueBox';
import GardenScene from './components/GardenScene';
import PlantListDisplay from './components/PlantListDisplay';
 
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

  return (
    <div className="App">
      <GardenScene
        width={gardenData.width}
        height={gardenData.height}
        soilType={gardenData.soilType}
        light={gardenData.light}
        exposure={gardenData.exposure}
        recommendedPlants={recommendedPlants}
      />
      <h1 className='font-[Pressura] text-4xl font-normal absolute top-4 left-[50%] -translate-x-[50%]'>Stormhacks Project</h1>
      <PlantListDisplay plantNames={recommendedPlants} />
      <DialogueBox
        gardenData={gardenData}
        setGardenData={setGardenData}
        setRecommendedPlants={setRecommendedPlants}
      />
    </div>
  )
}

export default App

import { useState } from 'react'
import './index.css';
import DialogueBox from './components/DialogueBox';
import GardenScene from './components/GardenScene';
 
function App() {
  const [gardenData, setGardenData] = useState({
    width: 8,
    height: 8,
    location: 'vancouver',
    light: 'full',
    exposure: 'outside',
    soilType: 'sandy',
  });

  return (
    <div className="App">
      <GardenScene
        width={gardenData.width}
        height={gardenData.height}
        soilType={gardenData.soilType}
      />
      <h1 className='font-[Pressura] text-4xl font-normal absolute top-4 left-[50%] -translate-x-[50%]'>Stormhacks Project</h1>
      <DialogueBox
        gardenData={gardenData}
        setGardenData={setGardenData}
      />
    </div>
    /*<>
      
      
     </>*/
  )
}

export default App

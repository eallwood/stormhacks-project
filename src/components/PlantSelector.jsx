const PlantSelector = ({ plants, selectedPlant, onPlantSelect, hoveredPlantName }) => {
  if (!plants || plants.length === 0) {
    return null;
  }

  return (
    <div className="font-[Pressura] font-normal absolute bottom-5 left-5 w-72">
      <div className="bg-white p-4 rounded-lg border border-[#41653D]">
        <h2 className="font-inter text-xl mb-3">Recommended Plants</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {plants.map((plant, index) => {
            const displayName = plant.name.split(' (')[0];
            return (
              <div
                key={index}
                className={`flex items-center p-1 rounded transition-colors duration-200 ${
                  plant.name === hoveredPlantName ? 'bg-lime-100' : ''
                }`}
              >
                <input
                  type="radio"
                  id={`plant-${index}`}
                  name="plant-selection"
                  value={plant.name}
                  checked={selectedPlant?.name === plant.name}
                  onChange={() => onPlantSelect(plant)}
                  className="mr-2"
                />
                <label htmlFor={`plant-${index}`} className="text-sm">{displayName}</label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlantSelector;
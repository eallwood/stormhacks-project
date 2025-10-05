const PlantSelector = ({ plants, selectedPlant, onPlantSelect }) => {
  if (!plants || plants.length === 0) {
    return null;
  }

  return (
    <div className="font-[Pressura] font-normal absolute bottom-5 left-5 w-72">
      <div className="bg-white p-4 rounded-lg border border-[#41653D]">
        <h2 className="text-xl mb-2">Recommended Plants</h2>
        <div className="space-y-2">
          {plants.map((plant, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`plant-${index}`}
                name="plant-selection"
                value={plant.name}
                checked={selectedPlant?.name === plant.name}
                onChange={() => onPlantSelect(plant)}
                className="mr-2"
              />
              <label htmlFor={`plant-${index}`}>{plant.name}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantSelector;
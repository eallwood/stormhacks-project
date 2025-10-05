const PlantInfoDisplay = ({ plant }) => {
  if (!plant) {
    return null;
  }

  return (
    <div className="font-[Pressura] font-normal absolute bottom-5 left-80 w-72">
      <div className="bg-white p-4 rounded-lg border border-[#41653D] h-full">
        <h2 className="text-xl mb-2">{plant.name}</h2>
        <p className="text-sm text-gray-700">
          {plant.description}
        </p>
      </div>
    </div>
  );
};

export default PlantInfoDisplay;
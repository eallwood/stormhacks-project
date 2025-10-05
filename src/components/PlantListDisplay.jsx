const PlantListDisplay = ({ plantNames }) => {
  if (!plantNames || plantNames.length === 0) {
    return null;
  }

  return (
    <div className="font-[Pressura] font-normal fixed bottom-5 left-5 w-60">
      <div className="bg-white p-4 rounded-lg border border-[#41653D]">
        <h2 className="text-xl mb-2">Recommended Plants</h2>
        <ul className="list-disc list-inside space-y-1">
          {plantNames.map((plant, index) => (
            <li key={index}>{plant}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlantListDisplay;
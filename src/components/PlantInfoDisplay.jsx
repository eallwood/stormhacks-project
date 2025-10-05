import { plantDetails } from '../data/plantData';

const PlantInfoDisplay = ({ plant }) => {
  if (!plant) {
    return null;
  }

  let primaryName = plant.name;
  let secondaryName = '';
  const match = plant.name.match(/(.*?)\s*\((.*)\)/);
  if (match) {
    primaryName = match[1];
    secondaryName = `(${match[2]})`;
  }

  const details = plantDetails[plant.name];

  return (
    <div className="font-[Pressura] font-normal absolute bottom-5 left-80 w-72">
      <div className="bg-white p-4 rounded-lg border border-[#41653D] h-full">
        <h2 className="font-inter text-lg font-semibold mb-1">{primaryName}</h2>
        {secondaryName && <p className="text-xs italic text-gray-500 mb-3">{secondaryName}</p>}
        {details && (
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-gray-800">Ecological Benefits</h3>
              <p className="text-xs text-gray-700">{details.benefits}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-800">Care Tips</h3>
              <p className="text-xs text-gray-700">{details.careTips}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantInfoDisplay;
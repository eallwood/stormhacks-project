import { soilDetails } from '../data/soilData';

const SoilInfoDisplay = ({ soilType }) => {
  const details = soilDetails[soilType];

  if (!details) {
    return null;
  }

  return (
    <div className="font-[Pressura] font-normal absolute top-0 right-[110%] w-64">
      <div className="bg-white p-4 rounded-lg border border-[#41653D] h-full">
        <h2 className="font-inter text-lg font-semibold mb-2">{details.title}</h2>
        <div className="space-y-2 text-xs text-gray-700">
          <p>{details.para1}</p>
          <p>{details.para2}</p>
        </div>
      </div>
    </div>
  );
};

export default SoilInfoDisplay;
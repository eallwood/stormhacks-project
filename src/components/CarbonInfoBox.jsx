const CarbonInfoBox = ({ offsetData }) => {
  if (!offsetData) {
    return null;
  }

  return (
    <div className="font-[Pressura] font-normal w-96 bg-white p-4 rounded-lg border border-[#41653D]">
      <h2 className="text-xl mb-2">Estimated Carbon Offset</h2>
      <div className="text-center my-4">
        <p className="text-4xl font-bold">{offsetData.value} kg</p>
        <p className="text-sm text-gray-500">per year</p>
      </div>
      <p className="text-xs text-gray-600">
        {offsetData.explanation}
      </p>
    </div>
  );
};

export default CarbonInfoBox;
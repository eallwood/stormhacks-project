const CarbonEquivalentBox = ({ offsetData }) => {
  if (!offsetData || !offsetData.equivalent) {
    return null;
  }

  return (
    <div className="font-[Pressura] font-normal w-96 bg-white p-4 rounded-lg border border-[#41653D]">
      <h2 className="font-inter text-md mb-2">That's Equivalent To...</h2>
      <div className="text-center my-4">
        <p className="text-sm font-semibold capitalize">
          {offsetData.equivalent}
        </p>
      </div>
    </div>
  );
};

export default CarbonEquivalentBox;
const ViewToggle = ({ activeView, setActiveView }) => {
  return (
    <div className="font-[Pressura] font-normal fixed top-5 left-5 bg-white p-1 rounded-lg border border-[#41653D] flex items-center space-x-1 shadow-inner">
      <div
        className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg border border-[#41653D] transition-transform duration-300 ease-in-out ${
          activeView === 'planner' ? 'translate-x-0' : 'translate-x-[98%]'
        }`}
      />
      <button
        onClick={() => setActiveView('planner')}
        className={`relative z-10 px-4 py-1.5 rounded-lg w-40 text-center transition-colors duration-300 ${
          activeView === 'planner' ? 'text-black' : 'text-gray-500'
        }`}
      >
        Garden Planner
      </button>
      <button
        onClick={() => setActiveView('carbon')}
        className={`relative z-10 px-4 py-1.5 rounded-lg w-40 text-center transition-colors duration-300 ${
          activeView === 'carbon' ? 'text-black' : 'text-gray-500'
        }`}
      >
        Carbon Footprint
      </button>
    </div>
  );
};

export default ViewToggle;
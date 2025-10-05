import { useState } from 'react';

const DialogueBox = ({ gardenData, setGardenData, setRecommendedPlants }) => {
  const [stage, setStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGardenData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setApiError('');
    setRecommendedPlants([]);

    try {
      const response = await fetch('http://localhost:3001/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gardenData }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations.');
      }

      const data = await response.json();
      setRecommendedPlants(data);
      setStage(stage + 1); // Move to the results stage
    } catch (error) {
      console.error('API Error:', error);
      setApiError('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stages = [
    {
      title: 'Welcome!',
      content: <p>This is a multi-stage dialogue box. Click "Next" to begin.</p>,
    },
    {
      title: "Your Garden",
      content: (
        <>
        <p className="mb-4 text-sm">
          How big of a space do you have to start building your garden?
        </p>
        <div className="mb-4 flex flex-row gap-2 items-center">
          <p>Location:</p>
          <select
            name="location"
            value={gardenData.location}
            onChange={handleInputChange}
            placeholder="Enter the width of your garden"
            className="p-2 border rounded w-full mt-2"
          >
            <option value="vancouver">Vancouver</option>
          </select>
        </div>
        <div className="mb-4 flex flex-row gap-2 items-center">
          <p>Width:</p>
          <input
            type="number"
            name="width"
            value={gardenData.width}
            onChange={handleInputChange}
            placeholder="Width (m)"
            className="p-2 border rounded w-full mt-2"
          />
        </div>
        <div className="mb-4 flex flex-row gap-2 items-center">
          <p>Height:</p>
          <input
            type="number"
            name="height"
            value={gardenData.height}
            onChange={handleInputChange}
            placeholder="Height (m)"
            className="p-2 border rounded w-full mt-2"
          />
        </div>
        </>
      ),
    },
    {
      title: 'Light and Weather',
      content: (
        <>
          <div className="mb-4 flex flex-row gap-2 items-center">
            <p>Light:</p>
            <select
              name="light"
              value={gardenData.light}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mt-2"
            >
              <option value="shade">Shade</option>
              <option value="partial">Partial</option>
              <option value="full">Full</option>
            </select>
          </div>
          <div className="mb-4 flex flex-row gap-2 items-center">
            <p>Exposure:</p>
            <select
              name="exposure"
              value={gardenData.exposure}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mt-2"
            >
              <option value="outside">Outside</option>
              <option value="sheltered">Sheltered</option>
            </select>
          </div>
        </>
      ),
    },
    {
      title: 'Soil Type',
      content: (
        <>
          <p className="mb-4 text-sm">What type of soil do you have?</p>
          <div className="mb-4 flex flex-row gap-2 items-center">
            <p>Soil:</p>
            <select
              name="soilType"
              value={gardenData.soilType}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mt-2"
            >
              <option value="sandy">Sandy</option>
              <option value="clay">Clay</option>
              <option value="loamy">Loamy</option>
              <option value="silty">Silty</option>
              <option value="peaty">Peaty</option>
              <option value="chalky">Chalky</option>
            </select>
          </div>
        </>
      ),
    },{
      title: 'Thank You!',
      content: (
        <div>
          <p>Here is the information you provided:</p>
          <p className="mt-2 capitalize">
            <strong>Location:</strong> {gardenData.location}
          </p>
          <p className="mt-2">
            <strong>Garden Size:</strong> {gardenData.width}m x {gardenData.height}m
          </p>
          <p className="mt-2 capitalize">
            <strong>Light:</strong> {gardenData.light}
          </p>
          <p className="mt-2 capitalize">
            <strong>Exposure:</strong> {gardenData.exposure}
          </p>
          <p className="mt-2 capitalize">
            <strong>Soil Type:</strong> {gardenData.soilType}
          </p>
        </div>
      ),
    },
    {
      title: 'Your Plant Recommendations',
      content: (
        <div>
          {isLoading && <p>Generating your personalized garden plan...</p>}
          {apiError && <p className="text-red-500">{apiError}</p>}
          {!isLoading && !apiError && (
            <>
              <p className="mb-4">
                Success! We've generated a list of recommended plants for your garden.
              </p>
              <p>
                You can see the list in the bottom-left corner and the plants have been added to your 3D garden.
              </p>
            </>
          )}
        </div>
      ),
    },
  ];

  const currentStage = stages[stage];

  const handleNext = () => {
    if (stage === stages.length - 2) { // The summary stage
      handleConfirm();
    } else if (stage < stages.length - 1) {
      setStage(stage + 1);
    }
  };

  const handleBack = () => {
    if (stage === stages.length - 1) {
      // When going back from the final screen, reset the recommendations.
      setRecommendedPlants(null);
    }
    if (stage > 0) {
      setStage(stage - 1);
    }
  };

  return (
    <div className="font-[Pressura] font-normal fixed bottom-5 right-5 w-80">
      <div className='bg-white p-4 rounded-lg border border-[#41653D]'>
        <h2 className=" text-xl mb-2">{currentStage.title}</h2>
        <div>{currentStage.content}</div>
      </div>
      
      <div className="flex justify-between gap-4 mt-4">
        <button
          onClick={handleBack}
          disabled={stage === 0}
          className="px-auto py-2 w-full bg-white text-[#2F4C2C] rounded disabled:opacity-50 disabled:cursor-not-allowed border border-[#41653D]"
        >
          {stage === stages.length - 1 ? '<- Change Garden Conditions' : 'Back'}
        </button>
        {stage < stages.length - 1 && (
          <button
            onClick={handleNext}
            disabled={isLoading}
            className={`px-auto py-2 w-full text-[#2F4C2C] rounded border border-[#41653D] disabled:opacity-50 disabled:cursor-not-allowed ${
              stage === stages.length - 2 ? 'bg-[#DCE775]' : 'bg-[#DCE775]'
            }`}
          >
            {stage === stages.length - 2 ? (isLoading ? 'Generating...' : 'Confirm') : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;
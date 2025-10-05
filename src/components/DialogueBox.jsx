import { useState, useEffect } from 'react';
import SoilInfoDisplay from './SoilInfoDisplay';

const DialogueBox = ({ gardenData, setGardenData, setRecommendedPlants }) => {
  const [stage, setStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [ellipsis, setEllipsis] = useState('');

  // Animate the ellipsis when loading
  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setEllipsis((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 400);
      return () => clearInterval(intervalId);
    } else {
      setEllipsis('');
    }
  }, [isLoading]);

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
      title: 'Welcome to Greenprints!',
      content: (
        <p className="text-sm">
          Answer a few questions about your garden space, and we'll generate a
          personalized 3D garden plan with native plants suited for your
          environment. Click "Next" to begin.
        </p>
      ),
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
            <option value="burnaby">Burnaby</option>
            <option value="surrey">Surrey</option>
          </select>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="width-input">Width:</label>
            <input
              id="width-input"
              type="number"
              name="width"
              value={gardenData.width}
              onChange={handleInputChange}
              className="p-1 border rounded w-20 text-center"
              min="1"
              max="10"
            />
          </div>
          <input type="range" name="width" min="1" max="10" value={gardenData.width} onChange={handleInputChange} className="w-full" />
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="height-input">Height:</label>
            <input
              id="height-input"
              type="number"
              name="height"
              value={gardenData.height}
              onChange={handleInputChange}
              className="p-1 border rounded w-20 text-center"
              min="1"
              max="10"
            />
          </div>
          <input type="range" name="height" min="1" max="10" value={gardenData.height} onChange={handleInputChange} className="w-full" />
        </div>
        </>
      ),
    },
    {
      title: 'Light and Weather',
      content: (
        <>
          <div className="mb-8">
            <p className="mb-4 text-sm">How much light will your garden get?</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'full', label: 'Full Sun', style: { backgroundColor: '#FBBF24' } },
                { value: 'partial', label: 'Partial', style: { background: 'linear-gradient(to right, #FBBF24 50%, #9CA3AF 50%)' } },
                { value: 'shade', label: 'Shade', style: { backgroundColor: '#9CA3AF' } },
              ].map((light) => (
                <div key={light.value} className="flex flex-col items-center">
                  <div
                    className={`p-1 rounded-full cursor-pointer transition-all duration-200 w-14 h-14 flex items-center justify-center ${
                      gardenData.light === light.value ? 'ring-2 ring-offset-2 ring-[#41653D]' : ''
                    }`}
                    onClick={() => handleInputChange({ target: { name: 'light', value: light.value } })}
                  >
                    <div
                      className="w-12 h-12 rounded-full"
                      style={light.style}
                    />
                  </div>
                  <p className="text-xs mt-2 capitalize">{light.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm">Is your garden sheltered or exposed?</p>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="outside"
                  name="exposure"
                  value="outside"
                  checked={gardenData.exposure === 'outside'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="outside" className="text-sm">Exposed</label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="sheltered" name="exposure" value="sheltered" checked={gardenData.exposure === 'sheltered'} onChange={handleInputChange} className="mr-2" />
                <label htmlFor="sheltered" className="text-sm">Sheltered</label>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: 'Soil Type',
      content: (
        <div className="relative">
          <>
            <p className="mb-4 text-sm">What type of soil do you have?</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'sandy', label: 'Sandy' },
                { value: 'clay', label: 'Clay' },
                { value: 'loamy', label: 'Loamy' },
                { value: 'silty', label: 'Silty' },
                { value: 'peaty', label: 'Peaty' },
                { value: 'chalky', label: 'Chalky' },
              ].map((soil) => (
                <div key={soil.value} className="flex flex-col items-center">
                  <div
                    className={`p-1 rounded-full cursor-pointer transition-all duration-200 w-14 h-14 flex items-center justify-center ${
                      gardenData.soilType === soil.value ? 'ring-2 ring-offset-2 ring-[#41653D]' : ''
                    }`}
                    onClick={() => handleInputChange({ target: { name: 'soilType', value: soil.value } })}
                  >
                    <div
                      className="w-12 h-12 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(/src/img/${soil.value}.png)` }}
                    />
                  </div>
                  <p className="text-xs mt-2 capitalize">{soil.label}</p>
                </div>
              ))}
            </div>
          </>
          <SoilInfoDisplay soilType={gardenData.soilType} />
        </div>
      ),
    },{
      title: 'Thank You!',
      content: (
        <div className='text-xs'>
          <p>Here is the information you provided:</p>
          <p className="mt-2 capitalize flex justify-between">
            <strong>Location:</strong> {gardenData.location}
          </p>
          <p className="mt-2 flex justify-between">
            <strong>Garden Size:</strong> <span>{gardenData.width}m x {gardenData.height}m</span>
          </p>
          <p className="mt-2 capitalize flex justify-between">
            <strong>Light:</strong> {gardenData.light}
          </p>
          <p className="mt-2 capitalize flex justify-between">
            <strong>Exposure:</strong> {gardenData.exposure}
          </p>
          <p className="mt-2 capitalize flex justify-between">
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
              <p className="mb-4 text-xs">
                Success! We've generated a list of recommended plants for your garden.
              </p>
              <p className="text-xs">
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
        <h2 className="font-inter text-xl mb-2">{currentStage.title}</h2>
        <div>{currentStage.content}</div>
      </div>
      
      <div className="flex justify-between gap-4 mt-4">
        <button
          onClick={handleBack}
          disabled={stage === 0}
          className="px-auto py-2 w-full bg-white text-[#2F4C2C] rounded disabled:opacity-50 disabled:cursor-not-allowed border border-[#41653D]"
        >
          {stage === stages.length - 1 ? '← Change Garden Conditions' : 'Back'}
        </button>
        {stage < stages.length - 1 && (
          <button
            onClick={handleNext}
            disabled={isLoading}
            className={`px-auto py-2 w-full text-[#2F4C2C] rounded border border-[#41653D] disabled:opacity-50 disabled:cursor-not-allowed ${
              stage === stages.length - 2 ? 'bg-[#DCE775]' : 'bg-[#DCE775]'
            }`}
          >
            {stage === stages.length - 2 ? (isLoading ? `Thinking${ellipsis}` : 'Confirm') : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;
// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');

// Explicitly load the .env file from the project root
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

if (!process.env.GEMINI_API_KEY) {
  console.error('\n[FATAL ERROR] GEMINI_API_KEY not found. Server cannot start.');
  process.exit(1);
}

const app = express();
const port = 3001; // You can use any port

app.use(cors());
app.use(express.json());


// The list of plants you want Gemini to choose from
const plantList = [
  'Wild Rose (Rosa acicularis)',
  'Red Columbine (Aquilegia formosa)',
  'Sword Fern (Polystichum munitum)',
  'Kinnikinnick (Arctostaphylos uva-ursi)',
  //'Oregon Grape (Mahonia aquifolium)',
  'Salmonberry (Rubus spectabilis)',
  //'Douglas Aster (Symphyotrichum subspicatum)',
  'Western Trillium (Trillium ovatum)',
  //'Nootka Rose (Rosa nutkana)',
 // 'Pacific Bleeding Heart (Dicentra formosa)',
  //'Mock Orange (Philadelphus lewisii)',
  //'Snowberry (Symphoricarpos albus)',
  'Yarrow (Achillea millefolium)',
  //'Evergreen Huckleberry (Vaccinium ovatum)',
  //'Lupine (Lupinus polyphyllus)',
  //'Red Flowering Currant (Ribes sanguineum)',
  //'Bleeding Heart Vine (Clerodendrum thomsoniae)',
  'Ferns (Athyrium filix-femina)',
  //'Camassia (Camassia quamash)',
  'Vanilla Leaf (Achlys triphylla)',
  //'Indian Plum (Oemleria cerasiformis)',
  //'Twinflower (Linnaea borealis)',
  'Fireweed (Chamerion angustifolium)',
  'Pacific Rhododendron (Rhododendron macrophyllum)',
  //'Licorice Fern (Polypodium glycyrrhiza)',
  //'Coastal Strawberry (Fragaria chiloensis)',
  'Inside-Out Flower (Vancouveria hexandra)',
  //'Ocean Spray (Holodiscus discolor)'
];

app.post('/api/recommendations', async (req, res) => {
  const { gardenData } = req.body;

  if (!gardenData) {
    return res.status(400).json({ error: 'Garden data is required' });
  }

  const prompt = `
    Given the following garden conditions:
    - Location: ${gardenData.location}
    - Garden Size: ${gardenData.width}m x ${gardenData.height}m
    - Light: ${gardenData.light}
    - Exposure: ${gardenData.exposure}
    - Soil Type: ${gardenData.soilType}

    From the following list of available plants, which ones are most suitable for this garden?
    Available Plants: ${plantList.join(', ')}.

    Please provide a prioritized, ordered list of the top 5-7 most suitable plants. For each plant, provide a short, one-sentence description. Also, provide an estimated annual carbon offset in kilograms for a garden of the specified size filled with these plants, along with a brief explanation. Finally, provide a common activity whose carbon emissions are equivalent to the garden's offset value (e.g., 'X minutes of driving a standard car'). Format the response as a JSON object with two keys: "recommendations" (an array of objects with "name" and "description") and "carbonOffset" (an object with "value" as a number, "explanation" as a string, and "equivalent" as a string like 'driving a car for 62 kilometers'). It is crucial that the "name" field in the recommendations contains the exact string from the 'Available Plants' list. For example: { "recommendations": [...], "carbonOffset": { "value": 15.5, "explanation": "This estimate is based on...", "equivalent": "driving an average car for 62 kilometers" } }.
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      // Add a generationConfig to be more explicit
      generationConfig: {
        "temperature": 0.7,
        "topP": 1,
        "topK": 1,
      }
    };

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error("API Error Response:", errorBody);
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // Extract the text from the REST API's response structure
    // Add a safety check in case the response is not as expected
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
      throw new Error("Could not find generated text in API response.");
    }

    // Clean the response to be valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    res.json(JSON.parse(jsonString));
  } catch (error) {
    console.error('Error during direct API call:', error);
    res.status(500).json({ error: 'Failed to get recommendations from Gemini.' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;

  if (!message || !context) {
    return res.status(400).json({ error: 'A message and plant context are required.' });
  }

  const plantContext = context.map(p => p.name).join(', ');

  const prompt = `
    You are a helpful and friendly gardening assistant.
    The user's garden contains the following plants: ${plantContext}.
    Based on this context, answer the user's question concisely.
    User's question: "${message}"
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        "temperature": 0.7,
        "topP": 1,
        "topK": 1,
      }
    };

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error("API Error Response:", errorBody);
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ reply: text || "Sorry, I couldn't generate a response." });

  } catch (error) {
    console.error('Error during chat API call:', error);
    res.status(500).json({ error: 'Failed to get a response from the assistant.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

import express from 'express'
import dotenv from "dotenv"
import OpenAI from "openai"
const router = express.Router()
dotenv.config();
const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

//step 1: Take user input & return list of 5 artists
router.post('/', async (req, res) => {
  const userPrompt = req.body;

  console.log(userPrompt.text)

  const prompt = `Provide a list of music artists and song recommendations similar to ${userPrompt} based on these criteria:
    1. **Genre Match** - Ensure recommendations fall within the same genre or a highly related subgenre.
    2. **Musical Style** - Consider instrumentation, production style, and typical elements of the provided song.
    3. **Mood & Atmosphere** - Match the emotional feel (e.g., energetic, melancholic, chill, aggressive).
    4. **Tempo & Rhythm** - Avoid vastly different BPM (beats per minute) unless necessary for mood consistency.
    5. **Artist Similarity** - Prioritize artists who are commonly recommended alongside the given artist.
    in JSON format. 

     **Response Instructions:**
- **ONLY return JSON, no explanations, no markdown.**
- **Do not wrap the response in triple backticks
    
    Ensure the response follows this exact structure:

    {
      "artists": [
        {
          "name": "Artist Name",
          "song": "Song"
        },
        {
          "name": "Another Artist",
          "song": "Song A"
        }
      ]
    }

    Ensure that your recommendations are relevant, taking into account factors like genre, tempo, instrumentation, and general audience preferences. If the user provides an obscure artist or song, try to find the closest well-known matches.
    Only return the JSON object. Do not include any text or explanations.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a music recommendation AI assistant. The user will provide an artist and a song, and your task is to recommend 5 similar artists and songs based on genre, musical style, mood" },
      {
        role: "user",
        content: `${prompt}`,
      },
    ],
    store: true,
  });

  const response = completion.choices[0].message.content
  const jsonText = JSON.parse(response)
  console.log(jsonText)

  const filteredData = jsonText.artists.map(artist => ({
    name: artist.name,
    song: artist.song
  }))

  console.log(filteredData)
  res.json(filteredData);
})

//step 2: Use Spotify search endpoint to turn all artists to artist_ID

//step 3: Artist top tracks end point to return song recommendations

//step 4: pass back json of artists and song recs

export default router
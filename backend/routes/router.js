import express from 'express'
import dotenv from "dotenv"
import OpenAI from "openai"
const router = express.Router()
dotenv.config();
const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

//step 1: Take user input & return list of 5 artists
// router.post('/', async (req, res) => {
//   const userPrompt = req.body;

//   console.log(userPrompt.text)

//   const prompt = `You are a music recommendation assistant.

//   The user will give you a song and artist, and your job is to recommend 5 fresh, emotionally or stylistically similar songs. These should reflect the same vibe, mood, genre, or lyrical tone — not just artists from the same label.
  
//   🛑 Rules:
//   - No repeating artists or songs from previous outputs unless highly relevant
//   - Be creative, avoid obvious suggestions unless necessary
//   - Don’t recommend anything already mentioned in the prompt
//   - Return strictly JSON. No extra text, no markdown

//     {
//       "artists": [
//         {
//           "name": "Artist Name",
//           "song": "Song"
//         },
//         {
//           "name": "Another Artist",
//           "song": "Song A"
//         }
//       ]
//     }

//     Only return the JSON object. Do not include any text or explanations.`

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       { role: "system", content: "You are a music recommendation AI assistant. The user will provide an artist and a song, and your task is to recommend 5 similar artists and songs" },
//       {
//         role: "user",
//         content: `${prompt}`,
//       },
//     ],
//     store: true,
//   });

//   const response = completion.choices[0].message.content
//   const jsonText = JSON.parse(response)
//   console.log(jsonText)

//   const filteredData = jsonText.artists.map(artist => ({
//     name: artist.name,
//     song: artist.song
//   }))

//   console.log(filteredData)
//   res.json(filteredData);
// })

router.post('/', async (req, res) => {
  const userPrompt = req.body.text

  if (!userPrompt) {
    return res.status(400).json({ error: 'Missing "text" in request body' })
  }

  const systemMessage = `
You are a music recommendation expert.

The user will ask for music that matches the *vibe* or *energy* of a specific song, artist, or genre.

Your job is to recommend 5 songs that capture a similar mood, genre, or emotion.

🎯 Format your recommendations like this:
"Song Title" by Artist Name

DO NOT use markdown, backticks, or JSON formatting.
DO NOT include the original song or artist in your recommendations.
Just give a clean, human response. 
`

  const userMessage = `Recommend songs based on this: "${userPrompt}". Focus on vibe.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 1.0,
      top_p: 1.0,
    })

    let raw = completion.choices[0].message.content
    console.log('🧠 GPT Raw Output:\n', raw)

    // 🧼 Clean the response: remove extra whitespace, trim lines
    raw = raw.trim()

    // 🧠 Regex: match lines like "Sunflower" by Rex Orange County
    const matches = [...raw.matchAll(/"(.+?)"\s+by\s+(.+)/gi)]

    if (!matches.length) {
      return res.status(422).json({ error: 'Could not parse song recommendations.' })
    }

    const recommendations = matches.map(([_, song, artist]) => ({
      song: song.trim(),
      name: artist.trim().replace(/^[-\d.()\s]+/, '') // removes leading "1.", "-", etc
    }))

    console.log('✅ Parsed Recommendations:\n', recommendations)
    res.json(recommendations)

  } catch (err) {
    console.error('❌ Error during recommendation generation:', err)
    res.status(500).json({ error: 'Failed to generate song recommendations.' })
  }
})

export default router
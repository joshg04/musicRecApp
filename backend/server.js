import express from "express"
import cors from "cors"
import router from './routes/router.js'
import spotifyRouter from './routes/spotifyRoute.js'
const app = express()
const port = 5000
app.use(cors());
app.use(express.json());

//opens server port in local environment
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', (req, res) => {
  res.send('hello')
})

app.use('/api', router)
app.use('/spotify', spotifyRouter)
  


//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//             role: "user",
//             content: "Write a haiku about recursion in programming.",
//         },
//     ],
//     store: true,
// });

// console.log(completion.choices[0].message);

//day 2: express is set up to take in front end requests, next goal 
//       is to get front end value, assign it to chatgpt prompt, and get a return value

//from there we can decorate and format the response into the web app and think about adding other features like authentication

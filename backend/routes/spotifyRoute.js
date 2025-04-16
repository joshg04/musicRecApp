import express from 'express'
import dotenv from "dotenv"
const router = express.Router()
dotenv.config();
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

const getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json()
    console.log(data)
    return data.access_token;
}

router.get("/track_id_q/:id", async (req, res) => {
    const song_name = req.params.id
    const token = await getToken()

    const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(song_name)}&type=track&limit=1`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    const track_id = await result.json()
    const album_image = track_id.tracks.items[0].album.images[0].url
    const track_link = track_id.tracks.items[0].external_urls.spotify

    console.log("track_link: ", track_link)
    console.log("album url: ", album_image)

    res.json({
        'track_link': track_link,
        'album_img': album_image 
    })

})


export default router
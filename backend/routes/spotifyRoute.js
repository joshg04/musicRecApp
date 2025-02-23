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

router.get("/search-artist/:artistName", async (req, res) => {
    try {
        const artistName = req.params.artistName;
        const token = await getToken();

        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await response.json();

        if (!data.artists || data.artists.items.length === 0) {
            return res.status(404).json({ error: "Artist not found." });
        }

        const artist = data.artists.items[0];

        res.json({
            name: artist.name,
            id: artist.id,
            spotify_url: artist.external_urls.spotify,
            genres: artist.genres,
            followers: artist.followers.total,
            image: artist.images[0]?.url || "No image available",
        });
    } catch (error) {
        console.error("Error fetching artist ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/top-tracks/:artistId", async (req, res) => {
    try {
        const artistId = req.params.artistId;
        const token = await getToken();

        const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await response.json();

        if (!data.tracks || data.tracks.length === 0) {
            return res.status(404).json({ error: "No top tracks found for this artist." });
        }

        res.json(
            data.tracks.map(track => ({
                name: track.name,
                preview_url: track.preview_url,
                spotify_url: track.external_urls.spotify,
                album_cover: track.album.images[0]?.url,
            }))
        );
    } catch (error) {
        console.error("Error fetching top tracks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})



export default router
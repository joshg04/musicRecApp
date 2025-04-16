const router = express.Router()
import express from 'express'
import dotenv from "dotenv"
dotenv.config();
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

router.get('/get_user_tracks', async (req, res) => {
    const userId = req.query.user_id


    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', userId)

    if(error){
        console.error("unable to retrieve songs", error.message)
    }
    if(data){
        console.log(data)
    }

    res.send(data)
})

router.post('/post_user_tracks', async (req, res) => {
    const { song_name, song_url, img_url, userId } = req.body

    const { data, error } = await supabase
        .from('songs')
        .insert([{ song_name: song_name, song_url: song_url, img_url: img_url, user_id: userId }])

    if (error) {
        console.error('Supabase insert error:', error.message);
        return res.status(500).json({ error: 'Failed to insert song' });
    }

    return res.status(201).json({ message: 'Song added!', data });

})

router.delete('/delete_user_track', async (req, res) => {
    const {songId, userId} = req.body

    const {data, error} = await supabase
        .from('songs')
        .delete()
        .eq('user_id', userId)
        .eq('id', songId)
        .select()

    if(error){
        console.error('delete error: ', error.message)
        res.send(error)
    }
    if(data){
        console.log(data)
        res.send(data)
    }

})

router.post('/addUser', async (req, res) => {
    const {email, password} = req.body

    try{
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password
        })

        console.log('User succesfully signed up!')
        return res.send(data)

    } catch(error){
        console.log(error)
        return res.send(error)
    }

})

router.post('/login', async (req, res) => {
    const {email, password} = req.body
    console.log(email)
    console.log(password)
    try{
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        

        if (error) {
            console.error('Login error:', error.message)
            return res.status(401).json({ error: error.message })
          }

        console.log('User succesfully signed in!')
        const token = data?.session?.access_token
        console.log(token)
        res.status(200).json({
            token,
            user: data?.user
          })

    } catch(error){
        console.log(error)
        res.send(error)
    }

})


export default router
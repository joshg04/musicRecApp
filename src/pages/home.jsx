import homeCSS from './home.module.css'
import SideNav from '../components/sidenav'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import {useState, useEffect} from 'react'
import { Link, useNavigate } from "react-router";
import { useAuth } from '../auth/authContext';
import { Navigate } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';


export default function Home(){

    const [input, setInput] = useState("")
    const [apiData, setApiData] = useState([])
    const [imgLink, setImgLink] = useState("")
    const [songLink, setSongLink] = useState("")
    const [songName, setSongName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { token, userId } = useAuth()
    const [userData, setUserData] = useState([])
    const navigate = useNavigate()

    

    const fetchDB = async () => {

        setIsLoading(true)
        const response = await fetch(`http://localhost:5000/database/get_user_tracks?user_id=${userId}`)
        const text = await response.text()

        if(response.ok && text){
            const data = JSON.parse(text)
            setUserData(data)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        console.log(userId)
        if (userId) {
          fetchDB()
        }
      }, [userId])

    const handleUserInput = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        
        
        //send a post request to the backend and retrieve artist/song data

        const response = await fetch('http://localhost:5000/api/', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: input
            })
        })
        const data = await response.json()
        setApiData(data)

        setIsLoading(false)
    }

    const handleAddBtn = async (e) => {
        setIsLoading(true)
        const track = (e.name + " - " + e.song)
        console.log(userId)

        const response = await fetch(`http://localhost:5000/spotify/track_id_q/${track}`)
        const data = await response.json()


        const addToDB = await fetch('http://localhost:5000/database/post_user_tracks', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                song_name: track,
                song_url: data.track_link,
                img_url: data.album_img,
                userId: userId
            })
        })

        const dbData = await addToDB.json()

        if(addToDB.ok){
            await fetchDB()
        }

        setIsLoading(false)
    }

    const handleDeleteBtn = async (id) => {

        console.log(id)

        const response = await fetch('http://localhost:5000/database/delete_user_track', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({ 
                songId: Number(id) ,
                userId: userId
            })
        })

        if(response.ok){
            console.log('Song Deleted')
            await fetchDB()
        }

    }
    
    const handleLogout = () => {
        sessionStorage.removeItem('token')
        navigate('/login')
    }

    return(
        <>
            <div className={homeCSS.container}>
                <div className={homeCSS.centerContainer}>
                    <h1 className={homeCSS.header1}>What kind of music are you feeling today?</h1>
                    <form onSubmit={handleUserInput} className={homeCSS.form}>
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)}
                            className={homeCSS.input}
                        ></input>
                    </form>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <h3>Recommendations:</h3>
                        </>
                    )}
                    <ul>
                        {apiData.map((foo) => (
                            <li key={`${foo.name}-${foo.song}`}>{foo.name} - {foo.song}
                            
                                <IconButton onClick={() => handleAddBtn(foo)}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={homeCSS.sidenav}>
                    <SideNav songs={userData} onDelete={handleDeleteBtn}/>
                </div>

                <div className={homeCSS.authBtns}>
                    {!token ? (
                        <>
                            <Link to="/login">
                                <Button variant="contained" sx={{backgroundColor: '#1F2937'}}>Log In</Button>
                            </Link>

                            <Link to="/addUser">
                                <Button variant="contained" sx={{backgroundColor: '#1F2937'}}>Sign Up</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleLogout} variant="contained" sx={{backgroundColor: '#1F2937'}}>Log Out</Button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

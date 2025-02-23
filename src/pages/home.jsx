import homeCSS from './home.module.css'
import SideNav from '../components/sidenav'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button';
import {useState, useEffect} from 'react'

export default function Home(){

    const [input, setInput] = useState("")
    const [apiData, setApiData] = useState([])

    const handleUserInput = async (e) => {
        e.preventDefault()
        
        //send a post request to the backend and retrieve artist/song data

        const response = await fetch('http://localhost:5000/api/', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: {input}
            })
        })
        const data = await response.json()
        setApiData(data)
        console.log(apiData)
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
                    <h3>Recommendations:</h3>
                    <ul>
                        {apiData.map(foo => (
                            <li>{foo.name} - {foo.song}
                            <IconButton>
                                <AddCircleOutlineIcon />
                            </IconButton>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={homeCSS.sidenav}>
                    <SideNav />
                </div>

                <div className={homeCSS.authBtns}>
                    <Button variant="contained" >Log In</Button>
                    <Button variant="contained">Sign Up</Button>
                </div>
            </div>
        </>
    )
}

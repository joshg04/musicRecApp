import loginCSS from "./log_in.module.css"
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from "react-router";
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from '../auth/authContext'
import CircularProgress from '@mui/material/CircularProgress';

export default function Login(){

    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        console.log(email)
        console.log(password)

        try{
            const res = await fetch('http://localhost:5000/database/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const data = await res.json()

            if (res.ok && data.token && data.user?.id) {
                login(data.token, data.user.id)
                navigate("/")
            }

        } catch(err) {
            console.error(err)
            alert('Invalid E-Mail or Password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={loginCSS.container}>
            <div className={loginCSS.innerContainer}>
                <h2>Log In</h2>
                <Box
                    component="form"
                    autoComplete="off"
                    sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: '5px'}}
                >
                    <TextField value={email} label="E-Mail" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
                    <TextField value={password} label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                    <>
                        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                    </>
                    )}
                </Box>
                <Divider variant="middle" component="h4"/>
                <div className={loginCSS.externalLinksContainer}>
                    <Link to="/signup"><h4>Don't have an account? Sign Up</h4></Link>
                </div>
            </div>
        </div>
    )
}
import signupCSS from "./sign_up.module.css"
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from "react-router";
import Divider from '@mui/material/Divider';
import { useState } from "react";

export default function Signup(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(email)
        console.log(password)

        try{
            const res = await fetch('http://localhost:5000/database/addUser', {
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
            console.log(data)
            alert('Check your email to verify your account')

        } catch(err) {
            console.error('Error adding user')
        }
    }

    return (
        <div className={signupCSS.container}>
            <div className={signupCSS.innerContainer}>
                <h2>Sign Up</h2>
                <Box
                    component="form"
                    autoComplete="off"
                    sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: '5px'}}
                >
                    <TextField name="email" label="E-Mail" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <TextField name="password" type="password" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                </Box>
                <Divider variant="middle" component="h4"/>
                <div className={signupCSS.externalLinksContainer}>
                    <Link to="/login"><h4>Already have an account? Log in</h4></Link>
                </div>
            </div>
        </div>
    )}
import sidenavCSS from './sidenav.module.css'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider';
import { useState, useEffect } from 'react';

const SideNav = ({ songs, onDelete }) => {


    return (
        <>
            <div className={sidenavCSS.container}>
                <h2>Your Saved Songs</h2>
                <div className={sidenavCSS.songListContainer}>
                    {songs.map((song) => (
                        <div key={song.id} className={sidenavCSS.songContainer}>
                            <img src={song.img_url} />
                            <div className={sidenavCSS.songNameContainer}>
                                <a href={song.song_url} target="_blank" rel="noreferrer">{song.song_name}</a>
                                <IconButton sx={{
                                    color: 'white',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        color: '#A78BFA', // optional: change color on hover
                                    },
                                }} onClick={() => onDelete(song.id)}>
                                    <DoNotDisturbOnIcon />
                                </IconButton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SideNav;
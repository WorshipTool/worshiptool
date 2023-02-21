import { AppBar, Box, Button, IconButton, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, Outlet } from 'react-router-dom';
import useAuth from '../hooks/auth/useAuth';
import geometryImage from '../assets/geometry.png'

import LoginIcon from '@mui/icons-material/Login';
import Login from '@mui/icons-material/Login';
import { motion } from 'framer-motion';
import Toolbar from '../components/Toolbar';

const Padder = styled(Box)(({})=>({
    flex:1,
    paddingLeft: "3.5rem",
    paddingRight: "3.5rem",
    display: "flex",
    flexDirection: "column"
}))
const Background = styled(Box)(({theme})=>({
    background: `linear-gradient(160deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
    position:"fixed",
    width:"100%",
    height:"100%",
    zIndex:-100,
    // background: `url(${geometryImage})`,
    // backgroundSize: "contain",
    // backgroundRepeat: "no-repeat",
    // filter: "brightness(200%) contrast(10%) hue-rotate(20deg) opacity(30%)"
    
}))



const StyledToolbar = styled(Toolbar)(({theme})=>({
    //background:`linear-gradient(70deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
    background: "transparent"
}))

const Container = styled(Box)(({})=>({
    width: "100%",
    display: "flex",
    flexDirection:"column"
}))

const TopBar = styled(Box)(()=>({
    position:"sticky",
    right:0,
    left:0,
    top:0,
    height: 50,
    alignItems:"center",
    display:"flex"
}))

export default function Home() {
    const theme = useTheme();
    return (
        <Container>
            {/* <AppBar position="sticky" style={{background: "transparent"}}>
                <StyledToolbar>
                    <motion.div style={{position:"absolute", left:0, top:0, right:0, bottom:0, 
                        background:`linear-gradient(70deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`}}
                        animate={{
                            opacity: isTop?0:1
                        }}>
                        
                    </motion.div>
                    <Button size={"small"} endIcon={<LoginIcon/>} color={"inherit"}>
                        Nejsi přihlášen
                    </Button>

                </StyledToolbar>
            </AppBar> */}

            <Toolbar transparent={false}/>

            <Background>

            </Background>
            <Padder>

                <Outlet></Outlet>
            </Padder>

            
            
            
        </Container>
    )
}

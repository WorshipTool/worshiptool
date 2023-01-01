import { Box, Button, IconButton, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Outlet } from 'react-router-dom';

export default function Home() {
    const theme = useTheme();

    const Container = styled(Box)(({})=>({
        width: "100%",
        display: "flex",
        flexDirection:"row",
    }))
    const Background = styled(Box)(({})=>({
        backgroundColor: theme.palette.grey[300],
        position:"fixed",
        width:"100%",
        height:"100%",
        zIndex:-100
        
    }))

    const SideBar = styled(Box)(()=>({
        backgroundColor: theme.palette.primary.dark,
        flexDirection:"column",
        justifyContent: "space-between",
        padding:"0.7rem",
        left:0,
        top:0,
        bottom:0,
        color:"white",
        [theme.breakpoints.down('md')]: {
            display:"none",
        },
        [theme.breakpoints.up('md')]: {
            display:"flex",
        },
        
    }))

    return (
        <Container>
            <Background>

            </Background>
            <SideBar> {/*This is used for offset outlet.*/}
                <IconButton size={"small"} color={"inherit"}>
                    <AccountCircleIcon/>
                </IconButton>
            </SideBar>
            <SideBar position={"fixed"}>
                <IconButton size={"small"} color={"inherit"}>
                    <AccountCircleIcon/>
                </IconButton>
                <IconButton size={"small"} color={"inherit"}>
                    <AddIcon/>
                </IconButton>
            </SideBar>

            <Outlet></Outlet>
            
            
        </Container>
    )
}

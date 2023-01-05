import { Box, Button, IconButton, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, Outlet } from 'react-router-dom';

export default function Home() {
    const theme = useTheme();

    const Container = styled(Box)(({})=>({
        width: "100%",
        display: "flex",
        [theme.breakpoints.down('md')]: {
            flexDirection:"column"
        },
        [theme.breakpoints.up('md')]: {
            flexDirection:"row",
        },
    }))
    const Background = styled(Box)(({})=>({
        background: `linear-gradient(160deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
        position:"fixed",
        width:"100%",
        height:"100%",
        zIndex:-100
        
    }))

    const SideBar = styled(Box)(()=>({
        background: `linear-gradient(68deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        flexDirection:"column",
        justifyContent: "space-between",
        padding:"0.7rem",
        color:"white",
        top:0,
        [theme.breakpoints.down('md')]: {
            display:"flex",
            flexDirection:"row",
            top:0,
            right: 0,
            left: 0

        },
        [theme.breakpoints.up('md')]: {
            display:"flex", 
            bottom:0,
        },
        
    }))

    const IconsBox = styled(Box)(()=>({
        [theme.breakpoints.down('md')]: {
            flexDirection:"row",

        },
        [theme.breakpoints.up('md')]: {
            flexDirection:"column",
        },
        
    }))

    const StyledIconButton = styled(IconButton)(()=>({
        color: "white"
    }))

    return (
        <Container>
            <Background>

            </Background>
            <SideBar sx={{opacity: 0}}>
                <StyledIconButton size={"small"}>
                    <HomeIcon/>
                </StyledIconButton>
            </SideBar>
            <SideBar position={"fixed"}>
                <IconsBox display={"flex"} gap={1}>
                    <Link to={""}>
                        <StyledIconButton size={"small"}>
                            <HomeIcon/>
                        </StyledIconButton>
                    </Link>
                    <StyledIconButton size={"small"}>
                        <AccountCircleIcon/>
                    </StyledIconButton>
                </IconsBox>
                <Link to={"create"}>
                    <StyledIconButton size={"small"}>
                        <AddIcon/>
                    </StyledIconButton>
                </Link>
            </SideBar>

            <Outlet></Outlet>
            
            
        </Container>
    )
}

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
        flexDirection:"row",
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

    const StyledIconButton = styled(IconButton)(()=>({
        color: "white"
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
                <Box display={"flex"} flexDirection={"column"} gap={1}>
                    <Link to={""}>
                        <StyledIconButton size={"small"}>
                            <HomeIcon/>
                        </StyledIconButton>
                    </Link>
                    <StyledIconButton size={"small"}>
                        <AccountCircleIcon/>
                    </StyledIconButton>
                </Box>
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

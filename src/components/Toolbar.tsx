import { Badge, Box, Button, Fade, IconButton, Menu, MenuItem, Paper, Popper, Tooltip, Typography, styled, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import Login from '@mui/icons-material/Login'
import LoginPopper from './LoginPopper'
import useAuth from '../hooks/auth/useAuth'
import AccountCircle from '@mui/icons-material/AccountCircle'
import AccountMenu from './AccountMenu'
import { useNavigate } from 'react-router-dom'
import BlackSheep from "../assets/images/blackSheep.png"
import WhiteSheep from "../assets/images/whiteSheep.png"
import {Build, Home } from '@mui/icons-material'
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import AppsIcon from '@mui/icons-material/Apps';
import useStack from '../hooks/playlist/useStack'


const TopBar = styled(Box)(()=>({
    right:0,
    left:0,
    top:0,
    height: 50,
    minHeight: 50,
    alignItems:"center",
    display:"flex",
    displayPrint:"none",
    zIndex:10
}))

interface ToolbarProps{
    transparent?: boolean
}
export default function Toolbar({transparent}:ToolbarProps) {
    const theme = useTheme();
    const [loginOpen, setLoginOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [accountMenuAnchor, setAccountMenuAnchor] = useState<HTMLButtonElement | null>(null);

    const {count} = useStack();

    const {user, isLoggedIn, logout, isAdmin} = useAuth();

    const navigate = useNavigate();


    useEffect(() => {
        const handleScroll = (event:any) => {
            setLoginOpen(false);            
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(()=>{
        setLoginOpen(false);
    },[user])

    const onHomeClick = () => {
        navigate("/");
        window.scrollTo(0, 0);
    }
    const onTestClick = () => {
        navigate("/test")
    }

    const onLoginButtonClick = (event:any) => {
        navigate('/login');
        //setLoginPopperAnchor(event.currentTarget);
        setLoginOpen(!loginOpen);
    }

    const onAccountButtonClick = (event:any) => {
        setAccountMenuAnchor(event.currentTarget);
        setAccountMenuOpen(!accountMenuOpen);
    }

    const onPlaylistClick = () => {
        navigate('/playlist');
    }

    return (
        <>
            <TopBar  displayPrint={"none"}  position={"sticky"} zIndex={0}>
            </TopBar>
            <TopBar  displayPrint={"none"} position={"fixed"}>
                <motion.div style={{ background:`linear-gradient(70deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    position:"absolute",
                    left:0, right:0,
                    top:0, bottom:0
                    }}
                    initial={{opacity:transparent?0:1}}
                    animate={{opacity: transparent?0:1}}
                    transition={{ duration: 0.3 }}/>
    
                <Box zIndex={0} flexDirection={"row"} display={"flex"} flex={1}>
                    
                    <Box flex={1} display={"flex"} alignItems={"center"} color={transparent?"black":"white"}>
                        
                        <Tooltip title={"Hlavní stránka"}>
                            <IconButton color='inherit' onClick={onHomeClick} sx={{marginLeft: 1}}>
                                <Home color={"inherit"}/>
                            </IconButton>
                        </Tooltip>
                        {isAdmin()&&
                        <>
                            <Tooltip title={"Testovací stránka"}>
                                <IconButton color='inherit' onClick={onTestClick} sx={{marginLeft: 1}}>
                                    <Build color={"inherit"} fontSize='small'/>
                                </IconButton>
                            </Tooltip>
                        </>
                        }
                        {isLoggedIn()&&<>
                            <Tooltip title={"Playlist"}>
                                <IconButton color="inherit" sx={{marginLeft:1}} onClick={(onPlaylistClick)}>
                                    <Badge badgeContent={count} color='primary'>
                                        <AppsIcon color='inherit' />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </>}
                    </Box>
                    <Box paddingRight={4} display={"flex"} flexDirection={"row"} alignItems={"center"} color={transparent?"black":"black"}>
                        {isLoggedIn()&&<Typography fontWeight={100} color={"inherit"}>Přihlášen jako</Typography>}
                        {!isLoggedIn()?<>
                            <Tooltip title={"Přihlásit se"}>
                                <Button endIcon={<Login/>} color={"inherit"} onClick={onLoginButtonClick}>
                                    Nejsi přihlášen
                                </Button>
                            </Tooltip>
                        </>:<>
                        
                            <Tooltip title={"Možnosti"}>
                                <Button endIcon={<AccountCircle/>} color={"inherit"} onClick={onAccountButtonClick}>
                                    {user?.firstName} {user?.lastName}
                                </Button>
                            </Tooltip>
                            
    
                        </>}
                        
    
                    </Box>
                </Box>
                <AccountMenu open={accountMenuOpen} anchor={accountMenuAnchor} onClose={()=>{setAccountMenuOpen(false)}}/>
                
            </TopBar>
        </>
    )
}

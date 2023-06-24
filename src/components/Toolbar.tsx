import { Badge, Box, Button, Fade, IconButton, Menu, MenuItem, Paper, Popper, Tooltip, Typography, styled, useTheme, Chip } from '@mui/material';
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import Login from '@mui/icons-material/Login'
import useAuth from '../hooks/auth/useAuth'
import AccountCircle from '@mui/icons-material/AccountCircle'
import AccountMenu from './AccountMenu'
import { useNavigate } from 'react-router-dom'
import {Build, FormatListBulleted, Home, List, ViewList } from '@mui/icons-material'
import useStack from '../hooks/playlist/useStack'
import useGroup from '../hooks/group/useGroup'


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

    const {isGroup, name: groupName, fullName: groupFullName, baseUrl} = useGroup();


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
        console.log(baseUrl+"/")
        navigate(baseUrl+"/");
        window.scrollTo(0, 0);
    }
    const onTestClick = () => {
        navigate(baseUrl+"/test")
    }

    const onLoginButtonClick = (event:any) => {
        navigate(baseUrl+'/login');
        //setLoginPopperAnchor(event.currentTarget);
        setLoginOpen(!loginOpen);
    }

    const onAccountButtonClick = (event:any) => {
        setAccountMenuAnchor(event.currentTarget);
        setAccountMenuOpen(!accountMenuOpen);
    }

    const onListClick = () => {
        navigate(baseUrl+"/list");
    }

    const onPlaylistClick = () => {
        navigate(baseUrl+'/playlist');
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
                    
                    <Box display={"flex"} alignItems={"center"} color={transparent?"black":"white"}>
                        
                        <Tooltip title={"Hlavní stránka"}>
                            <IconButton color='inherit' onClick={onHomeClick} sx={{marginLeft: 1}}>
                                <Home color={"inherit"}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Seznam písní"}>
                            <IconButton color='inherit' onClick={onListClick} sx={{marginLeft: 1}}>
                                <ViewList color={"inherit"}/>
                            </IconButton>
                        </Tooltip>
                        
                        
                    </Box>


                    <Box flex={1} display={"flex"} alignItems={"center"} justifyContent={"center"} color={transparent?"black":"white"}>
                        {isGroup&&<>
                            <Chip label={groupFullName?.toUpperCase()} sx={{minWidth: 300}}/>
                        </>}
                    </Box>


                    <Box paddingRight={4} display={"flex"} flexDirection={"row"} alignItems={"center"} color={transparent?"black":"black"}>
                        {isLoggedIn()&&<Typography fontWeight={100} color={"inherit"} sx={{
                            [theme.breakpoints.down("sm")]:{
                                display:"none"
                            }
                        }}>Přihlášen jako</Typography>}
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

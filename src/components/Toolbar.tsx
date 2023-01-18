import { Box, Button, Fade, Menu, MenuItem, Paper, Popper, Typography, styled, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import Login from '@mui/icons-material/Login'
import LoginPopper from './LoginPopper'
import useAuth from '../hooks/auth/useAuth'
import AccountCircle from '@mui/icons-material/AccountCircle'
import AccountMenu from './AccountMenu'
import { useNavigate } from 'react-router-dom'


const TopBar = styled(Box)(()=>({
    position:"sticky",
    right:0,
    left:0,
    top:0,
    height: 50,
    alignItems:"center",
    display:"flex",
    zIndex:10
}))

interface ToolbarProps{
    transparent: boolean
}
export default function Toolbar({transparent}:ToolbarProps) {
    const theme = useTheme();
    const [loginOpen, setLoginOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [accountMenuAnchor, setAccountMenuAnchor] = useState<HTMLButtonElement | null>(null);

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


    const onLoginButtonClick = (event:any) => {
        navigate('/login');
        //setLoginPopperAnchor(event.currentTarget);
        setLoginOpen(!loginOpen);
    }

    const onAccountButtonClick = (event:any) => {
        setAccountMenuAnchor(event.currentTarget);
        setAccountMenuOpen(!accountMenuOpen);
    }

    return (
        <TopBar>
            <motion.div style={{ background:`linear-gradient(70deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                position:"absolute",
                left:0, right:0,
                top:0, bottom:0,
                opacity:0
                }}
                animate={{opacity: transparent?0:1}}
                transition={{ duration: 0.3 }}/>

            <Box zIndex={0} flexDirection={"row"} display={"flex"} flex={1}>
                
                <Box flex={1} color={"black"}>
                </Box>
                <Box paddingRight={4} display={"flex"} flexDirection={"row"} alignItems={"center"} color={"black"}>
                    {isLoggedIn()&&<Typography fontWeight={100}>Přihlášen jako</Typography>}
                    {!isLoggedIn()?<>
                        <Button endIcon={<Login/>} color={"inherit"} onClick={onLoginButtonClick}>
                            Nejsi přihlášen
                        </Button>
                    </>:<>
                        <Button endIcon={<AccountCircle/>} color={"inherit"} onClick={onAccountButtonClick}>
                            {user?.firstName} {user?.lastName}
                        </Button>

                    </>}
                    

                </Box>
            </Box>
            <AccountMenu open={accountMenuOpen} anchor={accountMenuAnchor} onClose={()=>{setAccountMenuOpen(false)}}/>
            
        </TopBar>
    )
}

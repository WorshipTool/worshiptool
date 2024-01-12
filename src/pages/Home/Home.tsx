import { Box, InputBase, SpeedDial, SpeedDialAction, SpeedDialIcon,  Typography, styled, useTheme } from '@mui/material'
import React, {useEffect, useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '../../components/Toolbars/Toolbar';
import { motion } from 'framer-motion';
import { Close, Cloud, Edit, Subscriptions } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth';
import AddVideo from '../../components/AddVideo';
import AddSource from '../../components/AddSource';
import SearchedSongsList from './components/SearchedSongsList';
import RecommendedSongsList from './components/RecommendedSongsList/RecommendedSongsList';
import { grey } from '@mui/material/colors';
import FloatingAddButton from './components/FloatingAddButton';
import HomeDesktop from './HomeDesktop';
import HomeMobile from './HomeMobile';
import useGroup from '../../hooks/group/useGroup';
import Snowfall from 'react-snowfall';
import Snow from '../../components/Snow';


const SearchContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],
    padding: "0.5rem",
    paddingLeft:"0.8rem",
    paddingRight:"0.8rem",
    borderRadius: "0.5rem",
    display:"flex",
    
    justifyContent:"center",
    alignItems:"center",

}))
const SearchInput = styled(InputBase)(({theme})=>({
    flex:1,
    marginLeft:"0.5em",
    zIndex:100
}))



export default function Home() {
    const theme = useTheme();
    const {turnOff} = useGroup();    
    
    /**
     * Set document title
     */
    useEffect(()=>{
        document.title = "Chval Otce"
        turnOff();
    },[])

    return (
        <Box >
            <Box flex={1} display={"flex"} sx={{
                [theme.breakpoints.down('sm')] : {
                    display: "none"
                }
            }}>
                <HomeDesktop/>
            </Box>
            <Box flex={1} display={"none"} sx={{
                [theme.breakpoints.down('sm')] : {
                    display: "flex"
                }
            }}>
                <HomeMobile/>
            </Box>

        </Box>
        
    )
}

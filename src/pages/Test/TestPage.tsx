import { AppBar, Box, Button, IconButton, Skeleton, Toolbar, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TestPage() {

    const [isTop, setTop] = useState(true);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = (event:any) => {
            if(window.scrollY<50){
                setTop(true)
            }else{
                setTop(false)
            }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(()=>{
        console.log("Top: " + isTop);
    },[isTop])
      
    

    return (
        <Box>
            <Typography>Testovaci stranka pouze pro admina</Typography>
        </Box>
    )
}

import { AppBar, Box, Button, IconButton, Skeleton, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Toolbar from '../../components/Toolbar';
import useSongQuery from '../../hooks/song/useSongQuery';

export default function TestPage() {

    const getUnverified = useSongQuery({key:"all"})

    useEffect(()=>{
        getUnverified({});        
        document.title = "Testoiďák"
    },[])

    return (
        <Box>
            <Toolbar/>
            <Typography>Testovaci stranka pouze pro admina</Typography>
        </Box>
    )
}

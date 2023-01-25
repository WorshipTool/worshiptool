import { AppBar, Box, Button, IconButton, Skeleton, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Toolbar from '../../components/Toolbar';

export default function TestPage() {

    return (
        <Box>
            <Toolbar/>
            <Typography>Testovaci stranka pouze pro admina</Typography>
        </Box>
    )
}

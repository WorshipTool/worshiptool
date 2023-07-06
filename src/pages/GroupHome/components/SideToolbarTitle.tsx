import { Box, Tooltip, Typography } from '@mui/material'
import React from 'react'
import useGroup from '../hooks/useGroup';

export default function SideToolbarTitle() {
    const transforms = "translateX(-123px) translateY(-112px) rotate(-90deg)";

    const {logoUrl, fullName} = useGroup();
  return (
    // <Tooltip title={fullName} placement='right'>
        <Box sx={{
            width: 300,
            height: 56,
            zIndex: 100,
            position:"fixed",
            left:0,
            display:"flex",
            flexDirection:"row",
            justifyContent:"start",
            alignItems:"center",
            gap:2,
            transform:transforms,
            userSelect: "none",
            transition: "all 0.3s ease",
            "&:hover": {
                // transform: transforms + "scale(101%)",
                // filter: "blur(0.2px)"
            }
        }}>
            <img src={logoUrl} style={{
                filter: "drop-shadow(0px 4px 0px #fff)",
                pointerEvents:"none"
            }} height={"20"}/>
        <Typography variant='h6' >CB Třináctka</Typography>
        </Box>

    // </Tooltip>
  )
}

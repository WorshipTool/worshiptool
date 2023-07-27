import { Add } from '@mui/icons-material';
import { Box, Typography, styled, useTheme } from '@mui/material';
import React from 'react'

const Container = styled(Box)(({theme})=>({
    width: 180,
    height: 130,
    borderRadius: 8,
    boxShadow: `0px 4px 4px #00000060`,
    color: "black",
    display:"flex",
    flexDirection:"row",
    "&:hover":{
        filter: "brightness(97%)",
        transform: "scale(102%)",
        boxShadow: `0px 4px 8px #00000060`,
    },
    "&:active":{
        filter: "brightness(95%)",
        transform: "scale(100%)",
        boxShadow: `0px 4px 4px #00000060`,
    },
    
    transition: "all ease 0.2s",
    pointerEvents: "auto"
}));

interface GroupToolbarActionButtonProps {
    label?: string,
    icon?: React.ReactNode,
    onClick?: ()=>void,
    variant?: "primary" | "secondary" | "white"
}

export default function GroupToolbarActionButton({label = "", icon, onClick, variant = "white"}: GroupToolbarActionButtonProps) {
    const theme = useTheme();

    let bg;
    let color;
    switch(variant){
        case 'primary':
            bg = `linear-gradient(130deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`;
            color = "white";
            break;
        case 'secondary':
            bg = theme.palette.secondary.light;
            color = theme.palette.secondary.contrastText
            break;
        case 'white':
            bg = "white";
            color = "black"
            break;
    }

    return (
    <Container sx={{
        background: bg,
        color: color,
        stroke: color,
    }} onClick={onClick}>
        <Box sx={{padding: 3, paddingRight: icon?0:3}}>
            <Typography variant='h6' fontWeight={500} sx={{userSelect:"none"}} lineHeight={1.3}>{label}</Typography>
        </Box>
        {icon&&<Box padding={3} display={"flex"} alignItems={"end"} justifyContent={"end"}> 
            {icon}
        </Box>}
    </Container>
  )
}

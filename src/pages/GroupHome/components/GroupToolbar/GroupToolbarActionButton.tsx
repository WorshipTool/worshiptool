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
        transform: "scale(101%)",
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
    main?: boolean
}

export default function GroupToolbarActionButton({label = "", icon, onClick, main=false}: GroupToolbarActionButtonProps) {
    const theme = useTheme();
    return (
    <Container sx={{
        background: !main ? "white" : `linear-gradient(130deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: !main ? "black" : "white",
        stroke: !main ? "black" : "white",
    }}>
        <Box sx={{padding: 3, paddingRight: 0}}>
            <Typography variant='h6' sx={{userSelect:"none"}} lineHeight={1.3}>{label}</Typography>
        </Box>
        {icon&&<Box padding={3} display={"flex"} alignItems={"end"} justifyContent={"end"}> 
            {icon}
        </Box>}
    </Container>
  )
}

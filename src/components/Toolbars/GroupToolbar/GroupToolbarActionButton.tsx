import { Add } from '@mui/icons-material';
import { Box, CircularProgress, Fade, Typography, styled, useTheme } from '@mui/material';
import React, { useMemo } from 'react'

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
    secondaryLabel?: string,
    icon?: React.ReactNode,
    onClick?: ()=>void,
    variant?: "primary" | "secondary" | "white",
    visible?: boolean,
    id?: number,
    loading?: boolean
}

export default function GroupToolbarActionButton({
    label = "", 
    icon, onClick, 
    variant = "white", 
    visible = true, 
    id = 0, 
    secondaryLabel, 
    loading
}: GroupToolbarActionButtonProps) {

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

    const duration = 200
    return (
        <Container sx={{
            background: bg,
            color: color,
            stroke: color,
            filter: !loading? "" : "brightness(80%)",
        }} onClick={()=>{
            if(!loading){
                onClick?.();
            }
        }}>
            <Box sx={{padding: 3, paddingRight: icon?0:3}} lineHeight={1.3} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
                <Typography variant='h6' fontWeight={500} sx={{userSelect:"none"}} lineHeight={"inherit"}>{label}</Typography>
                {secondaryLabel&&<Typography variant='subtitle2' lineHeight={"inherit"} sx={{
                    textOverflow: "clip",
                    overflow: "hidden",
                    width: "80px",
                    opacity: 0.6,
                }} noWrap>{secondaryLabel}</Typography>}
            </Box>
            {icon&&<Box padding={3} display={"flex"} alignItems={"end"} justifyContent={"end"}> 
                {!loading ? icon: <>
                    <CircularProgress size={20} color='inherit'/>
                </>}
            </Box>}
        </Container>
  )
}

import { Box, Button, Link, Typography, styled } from '@mui/material'
import React, { useMemo } from 'react'
import { ReactComponent as SvgIcon } from '../../../assets/icon.svg'
import { useNavigate } from 'react-router-dom';


const Container = styled(Box)(({theme})=>({
    height: "100%",
    alignItems: "center",
    justifyContent: "start",
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    transition: "all 0.2s ease",
    '&:hover': {
        filter: "drop-shadow(4px 4px 4px #00000022)",
        transform: "scale(102%)"
    },
    '&:active': {
        transform: "scale(98%)"
    },
    // pointerEvents: "none",
    cursor: "default",
    userSelect: "none",
    pointerEvents: "auto"

}))
interface LeftWebTitleProps{
    transparent?: boolean;
}
export default function LeftWebTitle({transparent}: LeftWebTitleProps) {
    const navigate = useNavigate();


    const color = useMemo(()=>{
        return transparent ? "transparent" : "white"
    },[transparent])
    const size = 40;

    const goHomeClick = () => {
        navigate("/");
        window.scroll({
            top: 0,
            behavior: "smooth",
          });
    }
  return (
    <Container color={color} onClick={goHomeClick} display={transparent? "none" : "flex"}>
        <SvgIcon fill='white' height={size}/>
        <Typography fontWeight={900} fontSize={18} marginLeft={0}>Chvalotce</Typography>
    </Container>
  )
}

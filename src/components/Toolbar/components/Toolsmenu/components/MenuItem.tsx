import { Height } from '@mui/icons-material'
import { Box, Typography, styled } from '@mui/material'
import React from 'react'

interface MenuItemProps{
    title:string,
    img: string,
    onClick: ()=>any,
    disabled?: boolean
}

const Container = styled(Box)(({theme})=>({
    display: "flex",
    flexDirection: "column",
    width: 80,
    height: 80,
    borderRadius: 10,
    transition: "all 0.2s ease",
    backgroundColor: "transparent",
    ':hover': {
        backgroundColor: "#00000011"
    },
    ":active": {
        backgroundColor: "#00000022"
    },
    "&:active > *": {
        transform: "scale(96%)",
    }
}))

export default function MenuItem({title, img, onClick, disabled}: MenuItemProps) {
  return (
    <Container onClick={onClick} sx={{
        pointerEvents: disabled? " none": "auto",
        filter: disabled?"grayscale(100%)":"",
        opacity: disabled? 0.5 : 1
    }}>
        <Box flex={1} display={"flex"} flexDirection={"column"}>
            <Box flex={1} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{
                filter: "drop-shadow(1px 4px 2px #00000033)"
            }}>
                <img src={img}  height={"50px"} width={"60px"} style={{
                    objectFit: "contain",
                    pointerEvents: "none",
                    userSelect: "none"
                }}/>
            </Box>
            <Typography display={"flex"} alignItems={"end"} justifyContent={"center"} 
                variant='body2'
                sx={{
                    userSelect: "none"
                }}>{title}</Typography>
        </Box>
    </Container>
  )
}

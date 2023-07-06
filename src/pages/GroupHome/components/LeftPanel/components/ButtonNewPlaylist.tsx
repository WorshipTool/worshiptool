import { Add } from '@mui/icons-material'
import { Box, Typography, styled } from '@mui/material'
import React from 'react'

const Container = styled(Box)(({theme})=>({
    width: `calc(100% - ${theme.spacing(0)})`,
    background: `linear-gradient(50deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: "white",
    borderRadius: theme.spacing(1),
    transition: "all 0.2s ease",
    
    "&:hover": {
        transform: "scale(102%)",
        boxShadow: "0px 0px 4px 2px #00000022",
        filter: "brightness(98%)",
    },
    ":active": {
        transform: "scale(98%)"
    }
}))

export default function ButtonNewPlaylist() {
  return (
    <Container>
      <Box sx={{
        display:"flex",
        justifyContent:"center",
        alignItems:"end",
        margin: 2,
        marginLeft: 4,
        marginRight: 3
      }}>
        <Typography variant='h6'  sx={{userSelect:"none"}}>Vytvořit playlist</Typography>
        <Box height={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"end"}>
          <Add sx={{
            stroke: "white",
            strokeWidth: 2
          }}/>
        </Box>
      </Box>
    </Container>
  )
}

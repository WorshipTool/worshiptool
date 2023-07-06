import { Box, styled } from '@mui/material'
import React from 'react'
import Header from './components/Header'
import ButtonNewPlaylist from './components/ButtonNewPlaylist'

const Container = styled(Box)(({theme})=>({
    width: 224,
    height: "100%",
    backgroundColor: "#414141",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // paddingTop: theme.spacing(2)
}))

export default function LeftPanel() {
  return (
    <Container>
      <Box marginTop={2}>
        <Header/>
      </Box>

      <Box margin={3} display={"flex"} flex={1} flexDirection={"column"} justifyContent={"end"} alignItems={"center"}>
        <ButtonNewPlaylist/>
      </Box>
    </Container>
  )
}


import { Box, styled, useTheme } from '@mui/material'
import React, { useState } from 'react'
import SearchBar from '../../../../components/SearchBar/SearchBar'
import SongSearch from '../../../../components/songLists/SongSearch/SongSearch'
import Gap from '../../../../components/Gap'
import SongListCards from '../../../../components/songLists/SongListCards/SongListCards'

const Container = styled(Box)(({theme})=>({
    width: 300,
    position:"fixed",
    bottom:0,
    top:56,
    right:0,
    overflowY:"auto",
    boxShadow: `0px 0px 3px ${theme.palette.grey[400]}`,
    displayPrint: "none"
}))

export default function RightPanel() {
    const theme = useTheme();
    const [searchString, setSearchString] = useState("");
  return (
    <>
        <Container>
            <Box padding={1} paddingTop={0}>
                <Box position={"sticky"} top={0} paddingTop={1} sx={{
                    // backdropFilter: "blur(20px)"
                }}>
                    <SearchBar onChange={(v)=>setSearchString(v)}/>
                </Box>
                <Gap/>
                <SongSearch searchString={searchString} component={(v)=>{
                    return <SongListCards columns={1} variants={v}/>
                }}/>
            </Box>
        </Container>
        <Box width={300} displayPrint={"none"}></Box>
    </>
  )
}

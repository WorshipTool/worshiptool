import { Box, Button, IconButton, Paper, Typography, styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import Toolbar from '../../components/Toolbar';
import DefaultStyle from '../Sheet/styles/DefaultStyle';
import useSong from '../../hooks/song/useSong';
import useStack from '../../hooks/playlist/useStack';
import { Add, KeyboardArrowDown, KeyboardArrowUp, Remove } from '@mui/icons-material';
import { Masonry } from '@mui/lab';
import { grey } from '@mui/material/colors';
import Gap from '../../components/Gap';
import ReactDOM from 'react-dom';
import SidePanel from './SidePanel';
import { useNavigate } from 'react-router-dom';

const Container = styled(Box)(({theme})=>({
    padding: 30
}))


const PageBreak = () => {
    return <Box sx={{
        pageBreakAfter: "always"
    }}>

    </Box>
}

const Item = ({guid}:{guid:string}) => {
    const {song, getTransposedVariant, transpose} = useSong(guid);

    const {remove, count} = useStack();

    const onRemove = () => {
        remove(guid)
    }

    if(song===undefined)return <Typography>Something is wrong.</Typography>
    return <>
                <Paper sx={{padding:2, marginBottom: 1, displayPrint: "none"}}>
                    <Box position={"absolute"} marginTop={-13} id={"playlistItem_"+guid}></Box>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                        <Box>
                            <IconButton onClick={()=>{transpose(1);}}>
                                <Add/>
                            </IconButton>
                            <IconButton onClick={()=>{transpose(-1);}}>
                                <Remove/>
                            </IconButton>
                        </Box>
                        <Button variant='text' color='error' onClick={onRemove}>Odebrat z playlistu</Button>
                    </Box>
                    
                    <DefaultStyle song={song} variant={getTransposedVariant(0)}/>
                </Paper>
                
                <Box display={"none"} displayPrint={"block"}>
                    <DefaultStyle song={song} variant={getTransposedVariant(0)}/>
                    {count>1&&<PageBreak/>}
                </Box>
            </>
}

export default function PlaylistPreview() {

    const {songGUIDs} = useStack();
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/")
    }

    return (
        <Box>
            <Toolbar/>
            <Box display={"flex"} flexDirection={"row"}>
                <Container flex={1}>
                    {songGUIDs.length==0&&<Box display={"flex"} flexDirection={"column"}>
                        <Typography variant='subtitle1'>
                            V playlistu namáš zatím jedinou píseň. 
                        </Typography>
                        <Typography variant='subtitle1'>
                            Aby jsi mohl přidat píseň do playlistu, je třeba nejdřív nějakou najít...
                        </Typography>
                        <Gap/>
                        <Box>
                            <Button variant='contained' color='primary' onClick={goHome}>Hledat</Button>
                        </Box>
                    </Box>}
                    {songGUIDs.map((guid)=>{
                        return <Item guid={guid} key={guid}/>
                    })}
                </Container>
                <SidePanel/>
                <Box width={300}></Box>
            </Box>
        </Box>
    )
}

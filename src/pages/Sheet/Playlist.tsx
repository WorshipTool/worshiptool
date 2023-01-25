import { Box, Button, Typography, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useSong from '../../hooks/useSong'
import PlaylistItem from './PlaylistItem';
import Gap from '../../components/Gap';

const PlaylistContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],
    width:180,
    position:"fixed",
    top:50,
    bottom:0,
    right: 0,
    padding: 10,
    overflow:"scroll"
}))

export default function Playlist({onAdd}:{onAdd:()=>void}) {

    const [guids, setGUIDS] = useState<string[]>([]);

    const load = () => {

        let p = localStorage.getItem("playlist");
        if(p==null)p=JSON.stringify([])
    
        setGUIDS(JSON.parse(p));
    }

    const onAddClick = () => {
        onAdd();
        load();
    }

    const onRemove = () => {
        load();
    }

    useEffect(()=>{
        load();
    },[])

    return (
        <Box width={200}>
            <PlaylistContainer>
                <Typography variant='h6' fontWeight={"bold"}>Tvůj playlist</Typography>
                <Gap/>
                {guids.map((guid, i)=>{
                    return <PlaylistItem key={guid} guid={guid} index={i} onRemove={onRemove}/>
                })}
                <Button onClick={onAddClick}>Přidat</Button>
            </PlaylistContainer>
        </Box>
    )
}

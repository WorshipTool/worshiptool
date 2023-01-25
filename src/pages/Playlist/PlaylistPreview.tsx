import { Box, Button, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Toolbar from '../../components/Toolbar';
import DefaultStyle from '../Sheet/styles/DefaultStyle';
import useSong from '../../hooks/useSong';

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
    const {song} = useSong(guid);
    if(song===undefined)return <Typography>Something is wrong.</Typography>
    return <Box>
                <DefaultStyle song={song} variant={song.variants[0]}/>
                <PageBreak/>
            </Box>
}

export default function PlaylistPreview() {
    const [guids, setGUIDS] = useState<string[]>([]);

    const load = () => {

        let p = localStorage.getItem("playlist");
        if(p==null)p=JSON.stringify([])
    
        setGUIDS(JSON.parse(p));
    }

    useEffect(()=>{
        load();
    },[])

    const onPrint = () => {
        window.print();
    }

    return (
        <Box>
            <Toolbar/>
            <Container>
                {guids.length==0&&<Typography>
                    V playlistu nemáte přidané žádné písně
                    </Typography>}
                {guids.map((guid)=>{
                    return <Item guid={guid}/>
                })}
                <Button variant="contained" sx={{
                    position:"fixed",
                    bottom: 30,
                    right: 30,
                    displayPrint:"none"
                }} onClick={onPrint}>Vytisknout</Button>
            </Container>
        </Box>
    )
}

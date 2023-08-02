import React, { useEffect, useMemo } from 'react'
import useSong from '../../../hooks/song/useSong';
import useInnerPlaylist from '../hooks/useInnerPlaylist';
import useCurrentPlaylist from '../../../hooks/playlist/useCurrentPlaylist';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Paper, Skeleton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import DefaultStyle from '../../Sheet/styles/DefaultStyle';
import { PlaylistItemDTO } from '../../../interfaces/playlist/PlaylistDTO';

import {Sheet} from "@pepavlin/sheet-api"
import useAuth from '../../../hooks/auth/useAuth';



const PageBreak = () => {
    return <Box sx={{
        pageBreakAfter: "always"
    }}>

    </Box>
}

interface PlaylistItemProps{
    item: PlaylistItemDTO,
    reload: ()=>void
}

export const PlaylistItem = ({item,reload}:PlaylistItemProps) => {

    const {removeVariant, items, playlist, guid: playlistGuid, loading, setItemsKeyChord, isOwner} = useInnerPlaylist();
    const {turnOn} = useCurrentPlaylist();

    const [sheet, setSheet] = React.useState<Sheet>(new Sheet(item.variant.sheetData));
    const [number, setNumber] = React.useState(0);

    const {user, isLoggedIn} = useAuth();


    const onRemove = async () => {
        const result = await removeVariant(item.variant.guid)
        

        turnOn(playlistGuid)
    }

    const transpose = (value: number) => {
        sheet.transpose(value);
        rerender();

        if(isOwner){
            const c = sheet.getKeyChord()
            if(c) setItemsKeyChord(item, c)
        }

    }

    const navigate = useNavigate();

    const open = () => {
        navigate(`/song/${item.variant.songGuid}`)
    }

    const rerender = () => {
        setNumber((prev)=>prev+1);
    }

    useEffect(()=>{
        sheet.setKey(item.toneKey);
        rerender();
    },[item])

    if(loading)return <>
        <Skeleton variant='text' width={"50%"}></Skeleton>
        {Array(10).fill(0).map(()=><Skeleton variant='text' width={Math.round(Math.random()*40)+"%"}></Skeleton>)}
    
    </>
    return <>
                <Paper sx={{padding:2, marginBottom: 1, displayPrint: "none"}}>
                    <Box position={"absolute"} marginTop={-13} id={"playlistItem_"+item.guid}></Box>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                        {isOwner?<Box>
                            <IconButton onClick={()=>{transpose(1);}}>
                                <Add/>
                            </IconButton>
                            <IconButton onClick={()=>{transpose(-1);}}>
                                <Remove/>
                            </IconButton>
                        </Box>:<Box/>}
                        <Box display={"flex"} flexDirection={"row"}>
                            {isOwner&&<Button variant='text' color='error' onClick={onRemove}>Odebrat z playlistu</Button>}
                            <Button variant='text' onClick={open}>Otevřít</Button>
                        </Box>
                    </Box>
                    
                    <DefaultStyle sheet={sheet} variantData={item.variant}/>
                </Paper>
                
                <Box display={"none"} displayPrint={"block"}>
                    <DefaultStyle sheet={sheet} variantData={item.variant}/>
                    {items.length>1&&<PageBreak/>}
                </Box>
            </>
}

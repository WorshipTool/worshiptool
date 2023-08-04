import { Box, Typography } from '@mui/material'
import React from 'react'
import GroupToolbarActionButton from './GroupToolbarActionButton'
import Gap from '../../Gap'
import { Add, Edit, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import usePlaylists from '../../../hooks/playlist/usePlaylists'
import useCurrentPlaylist from '../../../hooks/playlist/useCurrentPlaylist'
import { isRequestSuccess } from '../../../apis/dtos/RequestResult'

interface QuickActionsProps {
    visible?: boolean
}

export default function QuickActions({visible}: QuickActionsProps) {
    const {createPlaylist} = usePlaylists();
    const {turnOn, isOn, guid, playlist} = useCurrentPlaylist();
    
    const navigate = useNavigate();

    const onCreatePlaylist = () => {
        createPlaylist().then((r)=>{
            if(isRequestSuccess(r)){
                const guid = r.data.guid;
                turnOn(guid);
                navigate("/playlist/"+guid)
            }
        })
    }

    const onSearchSong = () => {
        window.dispatchEvent(new Event("searchBarFocus"));
    }

    const onNewSong = () => {
        navigate("/create");
    }

    const openPlaylistToEdit = () => {
        navigate("/playlist/"+guid)
    }


  return (
    <Box>
        <Box display={"flex"} flexDirection={"row"} gap={1}>
            <GroupToolbarActionButton label='Vytvořit playlist' variant="primary" icon={<Add sx={{
                strokeWidth: 2,
            }}/>} onClick={onCreatePlaylist} visible={visible} id={0}/>
            <GroupToolbarActionButton label='Vyhledat píseň' icon={<Search  sx={{
                strokeWidth: 1,
            }}/>} onClick={onSearchSong} visible={visible} id={1}/>
            <GroupToolbarActionButton label='Vytvořit novou píseň' icon={<Add  sx={{
                strokeWidth: 2,
            }}/>} onClick={onNewSong} visible={visible} id={2}/>
            
            {isOn ? <GroupToolbarActionButton label='Editovat playlist' secondaryLabel={playlist?.title}
                variant="secondary"
                icon={<Edit></Edit>} onClick={openPlaylistToEdit} visible={visible} id={3}/> : <></>}
        </Box>
    </Box>
  )
}

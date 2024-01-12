import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import GroupToolbarActionButton from './GroupToolbarActionButton'
import Gap from '../../Gap'
import { Add, Edit, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import usePlaylists from '../../../hooks/playlist/usePlaylists'
import useCurrentPlaylist from '../../../hooks/playlist/useCurrentPlaylist'

interface QuickActionsProps {
    visible?: boolean
}

export default function QuickActions({visible}: QuickActionsProps) {
    const {createPlaylist} = usePlaylists();
    const {turnOn, isOn, guid, playlist} = useCurrentPlaylist();
    
    const navigate = useNavigate();

    const [createSongLoading, setCreateSongLoading] = useState(false);
    const [createPlaylistLoading, setCreatePlaylistLoading] = useState(false);

    const onCreatePlaylist = () => {
        setCreatePlaylistLoading(true);
        createPlaylist().then((r)=>{
            const guid = r.guid;
            turnOn(guid);
            navigate("/playlist/"+guid)
            setCreatePlaylistLoading(false);

        })
    }

    const onSearchSong = () => {
        window.dispatchEvent(new Event("searchBarFocus"));
    }

    const onNewSong = () => {
        setCreateSongLoading(true)
        navigate("/add");
        setCreateSongLoading(false)
    }

    const openPlaylistToEdit = () => {
        navigate("/playlist/"+guid)
    }


  return (
    <Box>
        <Box display={"flex"} flexDirection={"row"} gap={1}>
            <GroupToolbarActionButton label='Vytvořit playlist' variant="primary" icon={<Add sx={{
                strokeWidth: 2,
            }}/>} onClick={onCreatePlaylist} visible={visible} id={0} loading={createPlaylistLoading}/>
            <GroupToolbarActionButton label='Vyhledat píseň' icon={<Search  sx={{
                strokeWidth: 1,
            }}/>} onClick={onSearchSong} visible={visible} id={1}/>
            <GroupToolbarActionButton label='Vytvořit novou píseň' icon={<Add  sx={{
                strokeWidth: 2,
            }}/>} onClick={onNewSong} visible={visible} id={2} loading={createSongLoading}/>
            
            {isOn ? <GroupToolbarActionButton label='Editovat playlist' secondaryLabel={playlist?.title}
                variant="secondary"
                icon={<Edit></Edit>} onClick={openPlaylistToEdit} visible={visible} id={3}/> : <></>}
        </Box>
    </Box>
  )
}

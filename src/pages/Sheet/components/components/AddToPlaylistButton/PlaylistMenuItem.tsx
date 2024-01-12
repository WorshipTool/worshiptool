import { CheckCircle, PlaylistAdd } from '@mui/icons-material'
import { CircularProgress, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import React, { useEffect } from 'react'
import { PostAddVariantToPlaylistBodyDTO } from '../../../../../api/dtos/playlist/dtosPlaylist'
import { VariantDTO } from '../../../../../interfaces/variant/VariantDTO';
import usePlaylists from '../../../../../hooks/playlist/usePlaylists';

interface PlaylistMenuItemProps {
    variant: VariantDTO,
    guid: string,
    title: string,
}

export default function PlaylistMenuItem({
    variant,
    guid,
    title
}: PlaylistMenuItemProps) {
    const { addVariantToPlaylist: addToPlaylist, 
            removeVariantFromPlaylist: removeFromPlaylist} = usePlaylists();
    const {isVariantInPlaylist} = usePlaylists();

    const [loading, setLoading] = React.useState(true);
    const [isInPlaylist, setIsInPlaylist] = React.useState<boolean>(false);

    useEffect(()=>{
        if(variant){
            setLoading(true);
            isVariantInPlaylist(variant.guid, guid).then((r)=>{
                setIsInPlaylist(r);
                setLoading(false);
            })
        }
    },[variant])

    const reloadPlaylists = () => {
        return isVariantInPlaylist(variant.guid, guid).then((r)=>{
            setIsInPlaylist(r);
        });
    }
        
    const addVariantToPlaylist = (guid:string) => {
        setLoading(true);
        const body : PostAddVariantToPlaylistBodyDTO = {
            playlist: guid,
            variant: variant.guid

        }
        addToPlaylist(body.variant, guid)
        .then(async (result)=>{
            await reloadPlaylists();
            setLoading(false);
        })

    }

    
    const removeVariantFromPlaylist = (guid:string) => {
        setLoading(true);
        const body : PostAddVariantToPlaylistBodyDTO = {
            playlist: guid,
            variant: variant.guid
        }
        removeFromPlaylist(body.variant, guid)
        .then(async (result)=>{
            console.log(result);
            await reloadPlaylists();
            setLoading(false);
        })
    }

    
  return (
    <MenuItem key={guid + "pl"} onClick={()=>{
        if(!isInPlaylist) 
            addVariantToPlaylist(guid)
        else 
            removeVariantFromPlaylist(guid)
    }} disabled={loading}>                        
        <ListItemIcon>
            {loading ? 
                <CircularProgress size={"1rem"} color='inherit'/> 
            :
            <>
                {!isInPlaylist ?
                <PlaylistAdd fontSize='small'/> :
                <CheckCircle fontSize='small'/>}
            </>}
        </ListItemIcon>

        <ListItemText>
            {title}
        </ListItemText>
        
    </MenuItem>
  )
}

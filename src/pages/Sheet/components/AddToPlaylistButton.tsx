import { CheckCircle, PlaylistAdd, Add, KeyboardArrowDown, MoreHoriz } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import usePlaylists from '../../../hooks/playlist/usePlaylists';
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import { isRequestSuccess } from '../../../apis/dtos/RequestResult';
import { PostAddVariantToPlaylistBodyDTO } from '../../../apis/dtos/playlist/dtosPlaylist';

interface AddToPlaylistButtonProps {
    variant: VariantDTO
}

export default function AddToPlaylistButton({variant}: AddToPlaylistButtonProps) {
    const [open, setOpen] = React.useState(false);

    const [openDialog, setOpenDialog] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    }

    const {getPlaylistsOfUser, isVariantInPlaylist} = usePlaylists();
    const {addVariantToPlaylist: addToPlaylist, removeVariantFromPlaylist: removeFromPlaylist} = usePlaylists();


    const [playlists, setPlaylists] = useState<{guid:string, title:string}[]>([]);
    const [isInPlaylist, setIsInPlaylist] = useState<boolean[]>([])

    useEffect(()=>{
        if(variant) reloadPlaylists();
      },[variant])
  
      const reloadPlaylists = () => {
        getPlaylistsOfUser()
        .then(async (r)=>{
          if(isRequestSuccess(r)){
            
            const isArr : boolean[] = [];
            for(let i=0; i<r.data.playlists.length; i++){
                const playlist = r.data.playlists[i];
                const isInPlaylist = await isVariantInPlaylist(variant.guid,playlist.guid);
                isArr.push(isInPlaylist);
            }
            setIsInPlaylist(isArr);
              
            setPlaylists(r.data.playlists);
          }
        })
      }

        
    const addVariantToPlaylist = (guid:string) => {
        const body : PostAddVariantToPlaylistBodyDTO = {
        playlist: guid,
        variant: variant.guid

        }
        addToPlaylist(body.variant, guid)
        .then((result)=>{
        if(isRequestSuccess(result)){
            reloadPlaylists();
        }else{
            console.log(result);
        }
        })

    }

    
    const removeVariantFromPlaylist = (guid:string) => {
        const body : PostAddVariantToPlaylistBodyDTO = {
        playlist: guid,
        variant: variant.guid

        }
        removeFromPlaylist(body.variant, guid)
        .then((result)=>{
        console.log(result);
        if(isRequestSuccess(result)){
            reloadPlaylists();
        }else{
            console.log(result);
        }
        })
    }

    const maxItems = 4;
      
    return (
        <div>
            <Button
                onClick={handleClick}
                variant='contained'
                endIcon={<KeyboardArrowDown />}
                >
                Přidat do
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                {playlists.slice(0,maxItems).map((p, i)=>{
                    const add = !isInPlaylist[i];
                    return <MenuItem key={p.guid + "pl"} onClick={()=>{
                        if(add) 
                        addVariantToPlaylist(p.guid)
                        else 
                        removeVariantFromPlaylist(p.guid)
                    }}>                        
                        <ListItemIcon>
                            {add ?
                            <PlaylistAdd fontSize='small'/> :
                            <CheckCircle fontSize='small'/>}
                        </ListItemIcon>

                        <ListItemText>
                            {p.title}
                        </ListItemText>
                        
                    </MenuItem>
                })}

                {playlists.length>maxItems&&<>
                    <Divider />
                    
                    <MenuItem onClick={()=>setOpenDialog(true)}>
                        <ListItemIcon>
                            <MoreHoriz fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>
                            Další
                        </ListItemText>
                    </MenuItem>
                </>}


            </Menu>

            
            <Dialog open={openDialog} onClose={()=>setOpenDialog(false)}>
                    <DialogTitle>Přidat do playlistu</DialogTitle>
                    <DialogContent>
                        <Box>
                        {playlists.map((p, i)=>{

                        const add = !isInPlaylist[i];
                        return <Paper sx={{marginBottom: 1}} key={p.guid + "pl"}>
                            <Button startIcon={add ?
                            <PlaylistAdd /> :
                            <CheckCircle/>}
                            fullWidth
                            sx={{justifyContent: "start"}}
                            onClick={()=>{
                                    if(add) 
                                    addVariantToPlaylist(p.guid)
                                    else 
                                    removeVariantFromPlaylist(p.guid)
                                }}>{p.title}</Button>
                        </Paper>
                        })}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setOpenDialog(false)}>Zavřít</Button>
                    </DialogActions>
                </Dialog>
        </div>
    )
}

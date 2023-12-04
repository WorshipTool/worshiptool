import { CheckCircle, PlaylistAdd, Add, KeyboardArrowDown, MoreHoriz } from '@mui/icons-material';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import usePlaylists from '../../../../../hooks/playlist/usePlaylists';
import { VariantDTO } from '../../../../../interfaces/variant/VariantDTO';
import { isRequestSuccess } from '../../../../../api/dtos/RequestResult';
import { PostAddVariantToPlaylistBodyDTO } from '../../../../../api/dtos/playlist/dtosPlaylist';
import PlaylistMenuItem from './PlaylistMenuItem';

interface AddToPlaylistButtonProps {
    variant: VariantDTO
}

export default function AddToPlaylistButton({variant}: AddToPlaylistButtonProps) {
    const [open, setOpen] = React.useState(false);

    const [openDialog, setOpenDialog] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [loading, setLoading] = useState(true);
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    }

    const {getPlaylistsOfUser, isVariantInPlaylist} = usePlaylists();


    const [playlists, setPlaylists] = useState<{guid:string, title:string}[]>([]);

    useEffect(()=>{
        if(variant){
            setLoading(true);
            reloadPlaylists().then(()=>{
                setLoading(false);
            })
        }
      },[variant])
  
      const reloadPlaylists = () => {
        return getPlaylistsOfUser()
        .then(async (r)=>{
          if(isRequestSuccess(r)){
            
              
            setPlaylists(r.data.playlists);
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
                Přidat do playlistu
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
                {loading?<>

                    <MenuItem disabled>
                        <ListItemIcon>
                            <CircularProgress size={`1rem`} color='inherit'/>
                        </ListItemIcon>
                        <ListItemText>
                            Načítání...
                        </ListItemText>
                    </MenuItem>
                </>:<>
                    {playlists.length===0&&<>
                        <MenuItem disabled>
                            <ListItemText>
                                Nemáte žádné playlisty
                            </ListItemText>
                        </MenuItem>
                    </>}
                </>}
                {playlists.slice(0,maxItems).map((p, i)=>{
                    return <PlaylistMenuItem 
                        guid={p.guid} 
                        title={p.title}
                        variant={variant}/>
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

                            return <PlaylistMenuItem
                                        guid={p.guid}
                                        title={p.title}
                                        variant={variant}/>
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
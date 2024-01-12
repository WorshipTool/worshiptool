import { CheckCircle, PlaylistAdd, Add, KeyboardArrowDown, MoreHoriz, AddBox, AddCircle, PlaylistAddCircle } from '@mui/icons-material';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import usePlaylists from '../../../../../hooks/playlist/usePlaylists';
import { VariantDTO } from '../../../../../interfaces/variant/VariantDTO';
import PlaylistMenuItem from './PlaylistMenuItem';
import { useApiStateEffect } from '../../../../../tech/ApiState';

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
    const [{
        data : playlists, 
        loading
    }] = useApiStateEffect(()=>{
        return getPlaylistsOfUser().then((r)=>{
            return r.playlists;
        })
    }, []);

    useEffect(()=>{
        console.log(playlists)
    },[playlists])


    const theme = useTheme();
    const maxItems = 4;
      
    return (
        <div>
            <Button
                onClick={handleClick}
                variant='contained'
                endIcon={<KeyboardArrowDown />} 
                sx={{
                    [theme.breakpoints.down("md")]:{
                        display: "none"
                    }
                }}
                >
                Přidat do playlistu
            </Button>

            <IconButton sx={{
                [theme.breakpoints.up("md")]:{
                    display: "none"
                }
            }} onClick={handleClick} color='primary'>
                <PlaylistAddCircle/>
            </IconButton>
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
                    {playlists?.length===0&&<>
                        <MenuItem disabled>
                            <ListItemText>
                                Nemáte žádné playlisty
                            </ListItemText>
                        </MenuItem>
                    </>}
                </>}
                {playlists?.slice(0,maxItems).map((p, i)=>{
                    return <PlaylistMenuItem 
                        guid={p.guid} 
                        title={p.title}
                        variant={variant}/>
                })}

                {playlists&&playlists.length>maxItems&&<>
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
                        {playlists?.map((p, i)=>{

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

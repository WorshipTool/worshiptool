import { CheckCircle, PlaylistAdd, Add, KeyboardArrowDown, MoreHoriz, CopyAll, VideoFile, Tag, VerifiedUser } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Paper, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import usePlaylists from '../../../hooks/playlist/usePlaylists';
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import { isRequestSuccess } from '../../../api/dtos/RequestResult';
import { PostAddVariantToPlaylistBodyDTO } from '../../../api/dtos/playlist/dtosPlaylist';
import AddVideo from '../../../components/AddVideo';
import AddTag from '../../../components/AddTag';
import AddCreator from '../../../components/AddCreator';
import { Sheet } from '@pepavlin/sheet-api';
import Song from '../../../interfaces/song/song';
import { useSnackbar } from 'notistack';

interface AddToPlaylistButtonProps {
    sheet: Sheet,
    song: Song,
    reload: () => void
}

export default function SheetAdminButtons({sheet, song, reload}: AddToPlaylistButtonProps) {
    const [open, setOpen] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    }

    const {enqueueSnackbar} = useSnackbar()

    const [addVideoOpen, setAddVideoOpen] = useState(false);
    const [addTagOpen, setAddTagOpen] = useState(false);
    const [addCreatorOpen, setAddCreatorOpen] = useState(false);


    const onCopyClick = () => {
        navigator.clipboard.writeText(sheet?.getOriginalSheetData()||"")
        enqueueSnackbar("Data písně byla zkopírována do schránky")
    }

    const addCreator = () =>{
        setAddCreatorOpen(true)
        handleClose()
    }

    const addVideo = () => {
        setAddVideoOpen(true)
        handleClose()
    }

    const addTag = () => {
        setAddTagOpen(true)
        handleClose()
    }

    const theme = useTheme();

    return (
        <div>
            <Button
                onClick={handleClick}
                variant='contained'
                color={"secondary"}
                endIcon={<KeyboardArrowDown />}
                >
                Admin
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
                <MenuItem onClick={onCopyClick}>
                    <ListItemIcon>
                        <CopyAll fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Zkopírovat</ListItemText>
                </MenuItem>

                <MenuItem onClick={addCreator}>
                    <ListItemIcon>
                        <VerifiedUser fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Přidat autora</ListItemText>
                </MenuItem>

                <MenuItem onClick={addVideo}>
                    <ListItemIcon>
                        <VideoFile fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Přidat video</ListItemText>
                </MenuItem>

                <MenuItem onClick={addTag}>
                    <ListItemIcon>
                        <Tag fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Přidat tag</ListItemText>
                </MenuItem>

            </Menu>

            
            <AddVideo open={addVideoOpen} handleClose={()=>setAddVideoOpen(false)} songGuid={song?.guid} afterUpload={()=>{
                reload();
            }}/>
            <AddTag open={addTagOpen} handleClose={()=>setAddTagOpen(false)} songGuid={song?.guid} afterUpload={()=>{
                reload();
            }}/>
            <AddCreator open={addCreatorOpen} handleClose={()=>setAddCreatorOpen(false)} songGuid={song?.guid} afterUpload={()=>{
                reload();
            }}/>
        </div>
    )
}

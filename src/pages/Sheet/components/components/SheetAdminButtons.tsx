import { CheckCircle, PlaylistAdd, Add, KeyboardArrowDown, MoreHoriz, CopyAll, VideoFile, Tag, VerifiedUser } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Paper, useTheme } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import AddVideo from '../../../../components/AddVideo';
import AddTag from '../../../../components/AddTag';
import AddCreator from '../../../../components/AddCreator';
import { Sheet } from '@pepavlin/sheet-api';
import Song from '../../../../interfaces/song/song';
import { useSnackbar } from 'notistack';
import Buttons13ka from './Buttons13ka';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import useAuth from '../../../../hooks/auth/useAuth';

interface AddToPlaylistButtonProps {
    sheet: Sheet,
    song: Song,
    reload: () => void,
    variant: VariantDTO,
    onEditClick: (editable: boolean) => void,
    isInEditMode?: boolean,
    editLoading: boolean,
    editedTitle: string,
}

export default function SheetAdminButtons({
    sheet, 
    song, 
    reload, 
    variant,
    onEditClick,
    isInEditMode,
    editLoading,
    editedTitle
}: AddToPlaylistButtonProps) {


    const {isAdmin, user, apiConfiguration} = useAuth()

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
                <Buttons13ka variant={variant}/>

                {(isAdmin()&&variant.createdByLoader)&&
                    <ButtonGroup orientation='horizontal' sx={{
                        paddingX: theme.spacing(1),
                    }}>
                        <DeleteButton
                            reloadSong={reload}
                            variant={variant}/>
                        <EditButton 
                            onClick={onEditClick} 
                            inEditMode={isInEditMode} 
                            loading={editLoading}
                            sheetData={sheet?.getOriginalSheetData()||""}
                            title={editedTitle}/>
                    </ButtonGroup>}

                <Divider/>

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

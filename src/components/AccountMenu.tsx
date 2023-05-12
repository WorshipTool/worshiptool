import { Divider, ListItemIcon, Menu, MenuItem } from '@mui/material'
import React from 'react'
import useAuth from '../hooks/auth/useAuth'
import { click } from '@testing-library/user-event/dist/click';
import { useNavigate } from 'react-router-dom';
import { LibraryMusic, Logout, ManageAccounts, MusicNote } from '@mui/icons-material';


interface AccountMenuProps{
    anchor: Element|null,
    open: boolean,
    onClose: ()=>void
}

export default function AccountMenu({anchor, open, onClose}:AccountMenuProps) {
    const {logout} = useAuth();
    const navigate = useNavigate();

    const onLogoutClick = () => {
        logout();
        onClose();
    }

    const onSettingClick = () => {
        navigate("/account")
    }

    const onPlaylistsClick = () => {
        navigate("/account/playlists")
    }

    return (
        <Menu
            disableScrollLock 
            anchorEl={anchor}
            open={open}
            onClose={onClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
        >
            <MenuItem onClick={onPlaylistsClick}>
                <ListItemIcon>
                    <MusicNote fontSize="small" sx={{color:"black"}} color='inherit'/>
                </ListItemIcon>
                Playlisty
            </MenuItem>
            <Divider/>
            <MenuItem onClick={onSettingClick}>
                {/* <ListItemIcon>
                    <ManageAccounts fontSize="small" />
                </ListItemIcon> */}
                Spravovat
            </MenuItem>
            <MenuItem onClick={onLogoutClick}>
                {/* <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon> */}
                Odhlásit se
            </MenuItem>
        </Menu>
    )
}

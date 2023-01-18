import { Menu, MenuItem } from '@mui/material'
import React from 'react'
import useAuth from '../hooks/auth/useAuth'
import { click } from '@testing-library/user-event/dist/click';


interface AccountMenuProps{
    anchor: Element|null,
    open: boolean,
    onClose: ()=>void
}

export default function AccountMenu({anchor, open, onClose}:AccountMenuProps) {
    const {logout} = useAuth();

    const onLogoutClick = () => {
        logout();
        onClose();
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
            <MenuItem onClick={onLogoutClick}>Odhlásit se</MenuItem>
        </Menu>
    )
}

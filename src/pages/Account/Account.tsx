import { Box, Button, InputBase, Typography } from '@mui/material'
import React, { useState } from 'react'
import useAuth from '../../hooks/auth/useAuth'

export default function Account() {
    const {isLoggedIn,login, logout, user} = useAuth();

    const [email, setEmail] = useState("pe.pavlin@gmail.com");
    const [password, setPassword] = useState("semice");

    const onLoginClick = () => {
        login({email,password});
    }
    const onLogoutClick = () => {
        logout();
    }

    const onEmailChange = (event:any) => {
        setEmail(event.target.value);
    }

    const onPasswordChange = (event: any) => {
        setPassword(event.target.value);
    }
    return (
        <Box>
            {isLoggedIn()?
                <Button onClick={onLogoutClick}>Odhlásit se</Button>
            :
                <>
                    <Button onClick={onLoginClick}>Přihlásit se</Button>
                    <InputBase placeholder='Email' value={email} onChange={onEmailChange}></InputBase>
                    <InputBase placeholder='Heslo' value={password} onChange={onPasswordChange}></InputBase>
                </>

            }
            <Typography>Přihlášen? {isLoggedIn()+""}</Typography>


            {user&&<Typography>{user.name}</Typography>}
        </Box>
    )
}

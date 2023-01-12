import { Box, Button, Input, InputBase, Typography } from '@mui/material'
import React, { useState } from 'react'
import useAuth from '../../hooks/auth/useAuth'
import { SignUpRequestDTO } from '../../backend/dtosAuth';

export default function Account() {
    const {isLoggedIn,login, logout, signup, user} = useAuth();

    const [email, setEmail] = useState("pe.pavlin@gmail.com");
    const [password, setPassword] = useState("semice");

    const [semail, setSEmail] = useState<string>("");
    const [spassword, setSPassword] = useState<string>("");
    const [sfname, setSFName] = useState<string>("");
    const [slname, setSLName] = useState<string>("");

    

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

    const onSEmailChange = (e:any) => {
        setSEmail(e.target.value);
    }
    const onSPasswordChange = (e:any)=>{
        setSPassword(e.target.value);
    }
    const onSFNameChange = (e:any)=>{
        setSFName(e.target.value);
    }
    const onSLNameChange = (e:any)=>{
        setSLName(e.target.value);
    }

    const onSignUpClick = () => {
        const data: SignUpRequestDTO = {
            firstName: sfname,
            lastName: slname,
            email: semail,
            password: spassword
        }
        signup(data);
    }
    return (
        <Box padding={8}>
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


            {user&&<>
                <Typography>{user.firstName}</Typography>
                <Typography>{user.token}</Typography>
            </>}

            {!isLoggedIn()&&<>
            
            <Box display={"flex"} flexDirection={"column"} marginTop={5}>
                <Typography>Registrace:</Typography>
                <InputBase placeholder='Křestní jméno' value={sfname} onChange={onSFNameChange}></InputBase>
                <InputBase placeholder='Příjmení' value={slname} onChange={onSLNameChange}></InputBase>
                <InputBase placeholder='Email' value={semail} onChange={onSEmailChange}></InputBase>
                <InputBase placeholder='Heslo' value={spassword} onChange={onSPasswordChange}></InputBase>
                <Button onClick={onSignUpClick}>Vytvořit účet</Button>
            </Box>
            
            </>}
        </Box>
    )
}

import { Box, Button, Divider, IconButton, Input, Paper, TextField, Typography, styled, useTheme } from '@mui/material'
import React, { useState } from 'react'
import Gap from './Gap'
import useAuth from '../hooks/auth/useAuth'
import { isRequestError, isRequestSuccess } from '../backend/dtosRequestResult'
import Close from '@mui/icons-material/Close'

const Container = styled(Box)(()=>({
    minWidth: 300,
    padding: 16
}))

interface LoginPopperProps{
    onClose: ()=>void
}

export default function LoginPopper({onClose}:LoginPopperProps) {
    const [email, setEmail] = useState("pe.pavlin@gmail.com");
    const [password, setPassword] = useState("semice");

    const [isEmailOk, setIsEmailOk] = useState(true);
    const [emailMessage, setEmailMessage] = useState("");
    
    const [isPasswordOk, setIsPasswordOk] = useState(true)
    const [passwordMessage, setPasswordMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const theme = useTheme();

    const {login} = useAuth();

    const onEmailChange = (e:any) => {
        setEmail(e.target.value);
    }
    const onPasswordChange = (e:any) => {
        setPassword(e.target.value);
    }

    const onLoginClick = () => {
        let ok = true;
        if(email==""){
            setIsEmailOk(false);
            setEmailMessage("Zadejte email");
            ok=false;
        }else{
            setIsEmailOk(true);
            setEmailMessage("")
        }

        if(password==""){
            setIsPasswordOk(false);
            setPasswordMessage("Zadejte heslo");
            ok=false;
        }else{
            setIsPasswordOk(true);
            setPasswordMessage("")
        }

        if(ok) login({email, password},(result)=>{
            if(isRequestError(result)) setErrorMessage(result.message);
        });
    }

    return (
        <Container >
            <Box display={"flex"} flexDirection={"row"}>
                <Typography variant={'h5'} fontWeight={"bold"} flex={1}>Která jsi ovce?</Typography>
                <IconButton onClick={()=>{onClose()}}>
                    <Close/>
                </IconButton>
            </Box>
            <Gap/>
            {errorMessage!=""&&<>
                <Typography variant='subtitle2' color={"red"}>{errorMessage}</Typography>
                <Gap/>
            </>}
            
            <Typography variant='subtitle2'>Email</Typography>
            <TextField size="small" fullWidth value={email} onChange={onEmailChange}
                error={!isEmailOk} helperText={emailMessage}/>
            <Gap/>
            <Typography variant='subtitle2'>Heslo</Typography>
            <TextField size="small" fullWidth value={password} onChange={onPasswordChange}
                error={!isPasswordOk} helperText={passwordMessage}/>
            <Gap/>

            <Button onClick={onLoginClick}>Přihlásit se</Button>
        </Container>
    )
}

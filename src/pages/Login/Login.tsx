import { Box, Button, CircularProgress, Container, IconButton, Paper, Snackbar, TextField, Typography, styled, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/auth/useAuth';
import { RequestResult, isRequestError } from '../../apis/dtos/RequestResult';
import { Close } from '@mui/icons-material';
import Gap from '../../components/Gap';
import Toolbar from '../../components/Toolbars/Toolbar';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import User from '../../interfaces/user';
import { LoginResultDTO } from '../../apis/dtos/dtosAuth';
import GoogleLoginButton from './components/GoogleLoginButton';

const StyledContainer = styled(Paper)(({theme})=>({
    width: "30%",
    padding: 30,
    margin:50,
    [theme.breakpoints.down("md")]:{
        width: "50%"
    },
    [theme.breakpoints.down("sm")]:{
        width: "100%",
        margin: 10
    }
}))

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isEmailOk, setIsEmailOk] = useState(true);
    const [emailMessage, setEmailMessage] = useState("");
    
    const [isPasswordOk, setIsPasswordOk] = useState(true)
    const [passwordMessage, setPasswordMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [inProgress, setInProgress] = useState(false);

    
    const {enqueueSnackbar} = useSnackbar();

    const theme = useTheme();
    const navigate = useNavigate();

    const {login} = useAuth();

    useEffect(()=>{
        document.title = "Přihlašení"
    },[])

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

        if(ok) loginAction();
    }

    const loginAction = () => {
        setInProgress(true);
        login({email, password},(result : RequestResult<LoginResultDTO>)=>{
            setInProgress(false);
            if(isRequestError(result)) setErrorMessage(result.message);
            else{
                navigate("/");
            }
        });
    }

    return (
        <Box>
            <Toolbar transparent={false}/>
            <Box flex={1} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <StyledContainer>
                    <Box display={"flex"} flexDirection={"row"}>
                        <Typography variant={'h5'} fontWeight={"bold"} flex={1}>Která jsi ovce?</Typography>
                    </Box>
                    <Gap/>
                    {errorMessage!=""&&<>
                        <Typography variant='subtitle2' color={"red"}>{errorMessage}</Typography>
                        <Gap/>
                    </>}

                    
                    <Typography variant='subtitle2'>Email</Typography>
                    <TextField size="small" fullWidth value={email} onChange={onEmailChange}
                        error={!isEmailOk} helperText={emailMessage} disabled={inProgress} type="email"/>
                    <Gap/>
                    <Typography variant='subtitle2'>Heslo</Typography>
                    <TextField size="small" fullWidth value={password} onChange={onPasswordChange}
                        error={!isPasswordOk} helperText={passwordMessage} disabled={inProgress} type='password'/>
                    <Gap/>
        
                    <Button onClick={onLoginClick}>
                        Přihlásit se
                        {inProgress&& <CircularProgress color={"inherit"} size={16} sx={{marginLeft:1}}/> }
                    </Button>


                    <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"end"}>
                        <Typography variant={"subtitle2"}>Nemáte ještě účet?</Typography>
                        <Button size={"small"} onClick={()=>{
                            navigate("/signup");
                        }}>Vytvořte si ho</Button>
                    </Box>
                    <Gap value={2}/>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "end",
                    }}>
                        <GoogleLoginButton/>
                    </Box>
                </StyledContainer>
            </Box>
        </Box>
    )
}

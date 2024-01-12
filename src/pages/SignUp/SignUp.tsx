import { Box, Button, CircularProgress, Container, IconButton, Paper, Snackbar, TextField, Typography, styled, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/auth/useAuth';
import Gap from '../../components/Gap';
import Toolbar from '../../components/Toolbars/Toolbar';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../Login/components/GoogleLoginButton';

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

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isFirstNameOk, setIsFirstNameOk] = useState(true);
    const [firstNameMessage, setFirstNameMessage] = useState("");
    
    const [isLastNameOk, setIsLastNameOk] = useState(true)
    const [lastNameMessage, setLastNameMessage] = useState("");

    const [isEmailOk, setIsEmailOk] = useState(true);
    const [emailMessage, setEmailMessage] = useState("");
    
    const [isPasswordOk, setIsPasswordOk] = useState(true)
    const [passwordMessage, setPasswordMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");


    const [inProgress, setInProgress] = useState(false);

    const theme = useTheme();
    const navigate = useNavigate();

    const {signup} = useAuth();

    
    useEffect(()=>{
        document.title = "Vytvoření účtu"
    },[])

    const onFirstNameChange = (e:any) => {
        setFirstName(e.target.value);
    }
    const onLastNameChange = (e:any) => {
        setLastName(e.target.value);
    }

    const onEmailChange = (e:any) => {
        setEmail(e.target.value);
    }
    const onPasswordChange = (e:any) => {
        setPassword(e.target.value);
    }

    const onSignupClick = () => {
        setInProgress(true);

        let ok = true;
        if(firstName==""){
            setIsFirstNameOk(false);
            setFirstNameMessage("Zadejte své křestní jméno");
            ok=false;
        }else{
            setIsFirstNameOk(true);
            setFirstNameMessage("")
        }
        if(lastName==""){
            setIsLastNameOk(false);
            setLastNameMessage("Zadejte své příjmení");
            ok=false;
        }else{
            setIsLastNameOk(true);
            setLastNameMessage("")
        }

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

        if(ok){
            signup({email, password, firstName, lastName},(result)=>{
                navigate("/");
                setInProgress(false);
           })
        }else{
            setInProgress(false);

        }

        
    }


    return (
        <Box>
            <Toolbar transparent={false}/>
            <Box flex={1} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <StyledContainer>
                    <Box display={"flex"} flexDirection={"row"}>
                        <Typography variant={'h5'} fontWeight={"bold"} flex={1}>Nová ovce</Typography>
                    </Box>
                    <Gap/>
                    {errorMessage!=""&&<>
                        <Typography variant='subtitle2' color={"red"}>{errorMessage}</Typography>
                        <Gap/>
                    </>}
                    <Typography variant='subtitle2'>Křestní jméno</Typography>
                    <TextField size="small" fullWidth value={firstName} onChange={onFirstNameChange}
                        error={!isFirstNameOk} helperText={firstNameMessage}/>
                    <Gap/>
                    <Typography variant='subtitle2'>Příjmení</Typography>
                    <TextField size="small" fullWidth value={lastName} onChange={onLastNameChange}
                        error={!isLastNameOk} helperText={lastNameMessage}/>
                    <Gap/>
                    <Typography variant='subtitle2'>Email</Typography>
                    <TextField size="small" fullWidth value={email} onChange={onEmailChange}
                        error={!isEmailOk} helperText={emailMessage} type='email'/>
                    <Gap/>
                    <Typography variant='subtitle2'>Heslo</Typography>
                    <TextField size="small" fullWidth value={password} onChange={onPasswordChange}
                        error={!isPasswordOk} helperText={passwordMessage} type='password'/>
                    <Gap/>
        
                    <Button onClick={onSignupClick}>
                        Vytvořit účet
                        {inProgress&& <CircularProgress color={"inherit"} size={16} sx={{marginLeft:1}}/> }
                    </Button>

                    
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

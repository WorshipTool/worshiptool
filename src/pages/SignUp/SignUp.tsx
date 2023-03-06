import { Box, Button, Container, IconButton, Paper, Snackbar, TextField, Typography, styled, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/auth/useAuth';
import { isRequestError } from '../../backend/dtos/RequestResult';
import { Close } from '@mui/icons-material';
import Gap from '../../components/Gap';
import Toolbar from '../../components/Toolbar';
import { useNavigate } from 'react-router-dom';

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

        if(ok) signup({email, password, firstName, lastName},(result)=>{
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
                        error={!isEmailOk} helperText={emailMessage}/>
                    <Gap/>
                    <Typography variant='subtitle2'>Heslo</Typography>
                    <TextField size="small" fullWidth value={password} onChange={onPasswordChange}
                        error={!isPasswordOk} helperText={passwordMessage} type='password'/>
                    <Gap/>
        
                    <Button onClick={onSignupClick}>Vytvořit účet</Button>
                </StyledContainer>
            </Box>
        </Box>
    )
}

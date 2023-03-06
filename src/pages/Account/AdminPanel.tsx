import { Box, Button, InputBase, Typography } from '@mui/material'
import React, { useState } from 'react'
import useAuth from '../../hooks/auth/useAuth';
import useFetch from '../../hooks/useFetch';
import { getUrl_LOGIN } from '../../backend/urls';
import { RequestResult, codes, isRequestSuccess } from '../../backend/dtos/RequestResult';
import { LoginRequestDTO, LoginResultDTO } from '../../backend/dtos/dtosAuth';

export default function AdminPanel() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [token, setToken] = useState("");

    const {login} = useAuth();

    const {post} = useFetch();

    const showToken = () => {
        const body : LoginRequestDTO = {
            email,
            password
        }
        post({
            url: getUrl_LOGIN(),
            body
        }, (result : RequestResult<LoginResultDTO>) => {
            if(isRequestSuccess(result)){
                setToken(result.data.token);
                console.log(result.data.token);
            }
            
        })
    }

  return (
    <Box>
        <Typography>Ziskej token uzivatele:</Typography>
        <InputBase placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <InputBase placeholder='Heslo' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <Button onClick={showToken}>Získat token</Button>
        {token!=""&&<Typography>
            Token in console...    
        </Typography>}
    </Box>
  )
}

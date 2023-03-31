import { Box, Button, InputBase, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import useAuth from '../../hooks/auth/useAuth';
import useFetch from '../../hooks/useFetch';
import { getUrl_LOGIN, getUrl_GETSONGCOUNT } from '../../backend/urls';
import { RequestResult, codes, isRequestSuccess } from '../../backend/dtos/RequestResult';
import { LoginRequestDTO, LoginResultDTO } from '../../backend/dtos/dtosAuth';
import { songGetCountDTO } from '../../backend/dtos/dtosSong';

export default function AdminPanel() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {fetchData} = useFetch();

    const [songCount, setSongCount] = useState<number>();
    
    const getCount = async ()=>{
        const r = await fetchData<songGetCountDTO>({url: getUrl_GETSONGCOUNT()});
        setSongCount(r.data.count);
    }

    useEffect(() => {
        getCount();
        const interval = setInterval(getCount, 1000);

        return () => {
          clearInterval(interval);
        };
      }, []);
    

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


        <Box>
            <Typography>Aktualní počet písní: {songCount}</Typography>
        </Box>
    </Box>
  )
}

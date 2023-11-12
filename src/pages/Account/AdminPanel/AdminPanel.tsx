import { Box, Button, InputBase, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import useAuth from '../../../hooks/auth/useAuth';
import useFetch from '../../../hooks/useFetch';
import { getUrl_LOGIN, getUrl_GETSONGCOUNT } from '../../../api/urls';
import { RequestResult, codes, isRequestSuccess } from '../../../api/dtos/RequestResult';
import { LoginRequestDTO, LoginResultDTO } from '../../../api/dtos/dtosAuth';
import { songGetCountDTO } from '../../../api/dtos/dtosSong';
import useGroup from '../../../hooks/group/useGroup';
import AddToSelection from './components/AddToSelection';
import RemoveFromSelection from './components/RemoveFromSelection';
import Gap from '../../../components/Gap';

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
                navigator.clipboard.writeText(result.data.token);
                console.log(result.data.token);
            }
            
        })
    }

    const {isOn} = useGroup();

  return (
    <Box >
        <Typography>Ziskej token uzivatele:</Typography>
        <InputBase placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <InputBase placeholder='Heslo' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <Button onClick={showToken}>Získat token</Button>
        {token!=""&&<Typography>
            Token copied in clipboard...    
        </Typography>}


        <Box>
            <Typography>Aktualní počet písní: {songCount}</Typography>
        </Box>

        {isOn?<>
            <Gap/>
            <Typography variant='h6'>Spravovat playlist skupiny</Typography>
            <AddToSelection/>
            <RemoveFromSelection/>
        </>:<>
            <Typography>Skupina není aktivní</Typography>
        </>}

    </Box>
  )
}

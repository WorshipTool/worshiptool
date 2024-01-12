import { Box, Button, InputBase, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import useAuth from '../../../hooks/auth/useAuth';
import { getUrl_LOGIN, getUrl_GETSONGCOUNT } from '../../../api/urls';
import { LoginRequestDTO, LoginResultDTO } from '../../../api/dtos/dtosAuth';
import { songGetCountDTO } from '../../../api/dtos/dtosSong';
import useGroup from '../../../hooks/group/useGroup';
import AddToSelection from './components/AddToSelection';
import RemoveFromSelection from './components/RemoveFromSelection';
import Gap from '../../../components/Gap';
import { AuthApi, SongsApi } from '../../../api/generated';
import { handleApiCall } from '../../../tech/handleApiCall';

export default function AdminPanel() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const {fetchData} = useFetch();

    const [songCount, setSongCount] = useState<number>();
    const {login, apiConfiguration} = useAuth();
    const songsApi = new SongsApi(apiConfiguration);
    const authApi = new AuthApi(apiConfiguration);
    
    const getCount = async ()=>{
        handleApiCall(songsApi.songsControllerGetSongsCount())
        .then((r)=>{
            setSongCount(r.count);
        })
        .catch((e)=>{
            console.log(e);
        })
        // const r = await fetchData<songGetCountDTO>({url: getUrl_GETSONGCOUNT()});
        // setSongCount(r.data.count);
    }

    useEffect(() => {
        getCount();
        const interval = setInterval(getCount, 1000);

        return () => {
          clearInterval(interval);
        };
      }, []);
    

    const [token, setToken] = useState("");


    // const {post} = useFetch();

    const showToken = () => {
        const body : LoginRequestDTO = {
            email,
            password
        }
        handleApiCall(authApi.authControllerLogin(body))
        .then((r)=>{
            setToken(r.token);
            navigator.clipboard.writeText(r.token);
            console.log(r.token);
        })
        .catch((e)=>{
            console.log(e);
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

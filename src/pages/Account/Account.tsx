import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Input, InputBase, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/auth/useAuth'
import { LoginResultDTO, SignUpRequestDTO } from '../../backend/dtosAuth';
import { ROLES } from '../../models/user';
import Song from '../../models/song';
import useFetch from '../../hooks/useFetch';
import { getUrl_GETLOADERUNVERIFIEDSONGS, getUrl_GETSONGSBYQUERY, getUrl_GETUNVERIFIEDSONGS, getUrl_LOGIN } from '../../backend/urls';
import { RequestResult, isSuccess } from '../../backend/dtosRequestResult';
import SongVerify from './SongVerify';
import Toolbar from '../../components/Toolbar';
import { useNavigate } from 'react-router-dom';

export default function Account() {
    const {isLoggedIn, user,
            isTrustee, isAdmin} = useAuth();

    const [temail, setTEmail] = useState("");
    const [tpassword, setTPassword] = useState("");
    const [token, setToken] = useState("");

    const [loaderSongs, setLoaderSongs] = useState<string[]>([]);
    const [unverifiedSongs, setUnverifiedSongs] = useState<string[]>([]);
    const {fetchData} = useFetch();
    const {post} = useFetch();

    const navigate = useNavigate();

    useEffect(()=>{
        if(!isLoggedIn()){
            navigate("/login");
        }
    },[isLoggedIn])


    const loadUnverified = () => {
        fetchData({url: getUrl_GETUNVERIFIEDSONGS()}, (r)=>{
            if(isSuccess(r)){
                setUnverifiedSongs(r.data.guids);
            }
        });
    }

    const loadLoaderUnverified = () => {
        fetchData({url: getUrl_GETLOADERUNVERIFIEDSONGS()}, (r)=>{
            if(isSuccess(r)){
                setLoaderSongs(r.data.guids);
            }
        });
    }

    useEffect(()=>{
        if(isLoggedIn()==false||user===undefined)return;
        if(user.role!=ROLES.Trustee&&user.role!=ROLES.Admin)return;
        loadUnverified();

        if(user.role!=ROLES.Admin)return;
        loadLoaderUnverified();


    },[isLoggedIn()])

    

    const refresh = () =>{
        loadUnverified();
        loadLoaderUnverified();
    }

    const onTEmailChange = (e:any) => {
        setTEmail(e.target.value);
    }

    const onTPasswordChange = (e:any) => {
        setTPassword(e.target.value);
    }

    const showToken = () => {
        post({url: getUrl_LOGIN(), body:{
            email: temail,
            password: tpassword
        }},(d:RequestResult<LoginResultDTO>)=>{
            if(isSuccess(d))
                setToken(d.data.token);
        })
    }

    return (
        <>
            <Toolbar/>
            <Box padding={8}>
                
                <Typography>Přihlášen? {isLoggedIn()+""}</Typography>
    
    
                {user&&<>
                    <Typography>{user.firstName}</Typography>
                    <Typography>Admin: {user.role==ROLES.Admin?"Ano":"Ne"}</Typography>
                </>}
    
               
    
                {(isTrustee()||isAdmin())&&<>
                
                    {unverifiedSongs.map((s)=>{
                        return (
                            <SongVerify guid={s} key={s} afterClick={refresh}></SongVerify>
                        )
                    })}
    
                    
                
                </>}
    
                {(isAdmin())&&<>
                    {loaderSongs.length>0&&<Typography fontWeight={"bold"}>Unverified songs from loader</Typography>}
                    {loaderSongs.slice(0,10).map((s)=>{
                        return (
                            <SongVerify guid={s} key={s} afterClick={refresh}></SongVerify>
                        )
                    })}
    
                    
                
                </>}
    
                {isAdmin()&&<>
                
                    <Divider />
                    <Typography>Získej token uživatele:</Typography>
                    <InputBase placeholder='email' value={temail} onChange={onTEmailChange}></InputBase>
                    <InputBase placeholder='password' value={tpassword} onChange={onTPasswordChange}></InputBase>
                    <Button onClick={showToken}>Získat</Button>
                    {token!=""&&<Typography>Token: {token}</Typography>}
                
                </>}
    
                
    
            </Box>
        </>

    )
}

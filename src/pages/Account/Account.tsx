import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Input, InputBase, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/auth/useAuth'
import { LoginResultDTO, SignUpRequestDTO } from '../../backend/dtosAuth';
import { ROLES } from '../../models/user';
import Song from '../../models/song';
import useFetch from '../../hooks/useFetch';
import { getUrl_GETSONGSBYQUERY, getUrl_LOGIN } from '../../backend/urls';
import { RequestResult, isSuccess } from '../../backend/dtosRequestResult';
import SongVerify from './SongVerify';

export default function Account() {
    const {isLoggedIn,login, logout, signup, user,
            isTrustee, isAdmin} = useAuth();

    const [email, setEmail] = useState("pe.pavlin@gmail.com");
    const [password, setPassword] = useState("semice");

    const [semail, setSEmail] = useState<string>("");
    const [spassword, setSPassword] = useState<string>("");
    const [sfname, setSFName] = useState<string>("");
    const [slname, setSLName] = useState<string>("");

    const [temail, setTEmail] = useState("");
    const [tpassword, setTPassword] = useState("");
    const [token, setToken] = useState("");

    const [unverifiedSongs, setUnverifiedSongs] = useState<string[]>([]);
    const {fetchData} = useFetch();
    const {post} = useFetch();


    const loadUnverified = () => {
        fetchData({url: getUrl_GETSONGSBYQUERY({
            key: "unverified"
        })}, (r)=>{
            if(isSuccess(r)){
                setUnverifiedSongs(r.data.guids);
            }
        });
    }
    useEffect(()=>{
        if(isLoggedIn()==false||user===undefined)return;
        if(user.role!=ROLES.Admin)return;

        loadUnverified();


    },[isLoggedIn()])

    

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

    const refresh = () =>{
        loadUnverified();
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
                <Typography>Admin: {user.role==ROLES.Admin?"Ano":"Ne"}</Typography>
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

            {(isTrustee()||isAdmin())&&<>
            
                {unverifiedSongs.map((s)=>{
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
    )
}

import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/auth/useAuth';
import { getUrl_GETLOADERUNVERIFIEDSONGS, getUrl_GETUNVERIFIEDSONGS } from '../../backend/urls';
import useFetch from '../../hooks/useFetch';
import { isSuccess } from '../../backend/dtosRequestResult';
import { ROLES } from '../../models/user';
import SongVerify from './SongVerify';

export default function VerifySongPanel() {
    const {isLoggedIn, user,
        isTrustee, isAdmin} = useAuth();

        

    const [loaderSongs, setLoaderSongs] = useState<string[]>([]);
    const [unverifiedSongs, setUnverifiedSongs] = useState<string[]>([]);

    
    const {fetchData} = useFetch();
    const {post} = useFetch();


    
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


    
    return (
        <Box>
            
                
        
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
        </Box>
    )
}

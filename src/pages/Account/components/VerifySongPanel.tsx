import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../../../hooks/auth/useAuth';
import { ROLES } from '../../../interfaces/user';
import SongVerify from './SongVerify';
import useSongQuery from '../../../hooks/song/useSongQuery';

export default function VerifySongPanel() {
    const {isLoggedIn, user,
        isTrustee, isAdmin} = useAuth();

        

    const [loaderSongs, setLoaderSongs] = useState<string[]>([]);
    const [unverifiedSongs, setUnverifiedSongs] = useState<string[]>([]);

    
    // const {fetchData} = useFetch();
    // const {post} = useFetch();


    
    const getUnverified = useSongQuery("unverified");
    const getLoaderUnverified = useSongQuery("loaderUnverified");

    const loadUnverified = () => {
        getUnverified().then((r)=>{
            // if(isRequestSuccess(r)){
                setUnverifiedSongs(r.songs.map((s:any)=>s.guid));
            // }
        })
    }
    const loadLoaderUnverified = () => {
        getLoaderUnverified().then((r)=>{
            setLoaderSongs(r.songs.map((s)=>s.guid));
            
        })
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

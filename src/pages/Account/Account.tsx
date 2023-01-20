import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Input, InputBase, Tab, Tabs, Typography } from '@mui/material'
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
import TabPanel from './TabPanel';
import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';

export default function Account() {
    const {isLoggedIn, user,
            isTrustee, isAdmin} = useAuth();

    const navigate = useNavigate();

    const [tabValue, setTabValue] = useState(1);

    useEffect(()=>{
        if(!isLoggedIn()){
            navigate("/login");
        }
    },[isLoggedIn])

    const onTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    }


    return (
        <>
            <Toolbar/>
            <Box padding={8}>
                
            <Box
            sx={{ flexGrow: 1, display: 'flex'}}
            >
            <Tabs
                    orientation="vertical"
                    value={tabValue}
                    onChange={onTabChange}                    
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                    <Typography variant='h6' sx={{marginBottom: 3}}>Váš účet</Typography>

                    <Tab label="Informace" />
                    <Tab label="Změnit heslo" />
                </Tabs>
                <TabPanel value={tabValue} index={1}>
                    <BasicInfo/>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <ChangePassword/>
                </TabPanel>
            </Box>
    
                
    
            </Box>
        </>

    )
}

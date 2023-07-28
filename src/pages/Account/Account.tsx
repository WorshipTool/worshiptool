import { Box, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/auth/useAuth'
import Toolbar from '../../components/Toolbar/Toolbar';
import { useNavigate } from 'react-router-dom';
import TabPanel from './TabPanel';
import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';
import VerifySongPanel from './VerifySongPanel';
import AdminPanel from './AdminPanel';

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
    
    useEffect(()=>{
        document.title = "Váš účet"
    },[])

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
                    {(isTrustee()||isAdmin())&&<Tab label="Ověřování" />}
                    {(isAdmin())&&<Tab label="ejdmin" />}
                </Tabs>
                <TabPanel value={tabValue} index={1}>
                    <BasicInfo/>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <ChangePassword/>
                </TabPanel>
                
                <TabPanel value={tabValue} index={3}>
                    <VerifySongPanel/>
                </TabPanel>
                <TabPanel value={tabValue} index={4}>
                    <AdminPanel/>
                </TabPanel>
            </Box>
    
                
    
            </Box>
        </>

    )
}

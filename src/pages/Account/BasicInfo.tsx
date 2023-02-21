import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
import useAuth from '../../hooks/auth/useAuth'
import AccountImage from '../../assets/images/account.webp'
import { ROLES } from '../../models/user';
import Gap from '../../components/Gap';

export default function BasicInfo() {
    const {info} = useAuth();
  return (
    <Box display={"flex"} flexDirection={"column"}>
        <Box display={"flex"} flexDirection={"row"}>

            <img src={AccountImage} width={70} height={70} style={{opacity: 0.3}}/>
            <Box marginLeft={3} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                <Typography variant='h6'>{info.firstName} {info.lastName}</Typography>
                <Typography>{ROLES[info.role]}</Typography>
            </Box>
        </Box>

        <Gap value={3}/>

        <Box display={"flex"} flexDirection={"row"} gap={3}>
            <Box>
                <Typography variant='subtitle2'>Křestní jméno</Typography>
                <TextField size="small" fullWidth value={info.firstName} disabled/>
            </Box>
            <Box>
                <Typography variant='subtitle2'>Příjmení</Typography>
                <TextField size="small" fullWidth value={info.lastName} disabled/>
            </Box>
        </Box>

        <Gap/>

        <Typography variant='subtitle2'>Email</Typography>
        <TextField size="small" fullWidth value={info.email} disabled/>

        <Gap value={3}/>
        <Typography variant="caption">Informace uživatele zatím nelze změnit.</Typography>
        <Typography variant="caption">Na této funkcionalitě se zatím stále pracuje...</Typography>


    </Box>
  )
}

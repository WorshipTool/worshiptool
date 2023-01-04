import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import useSong from '../../hooks/useSong';

export default function Sheet() {
    const {guid} = useParams();
    const {setGUID, interface:song, getName, getText, getSheetData} = useSong(null);

    useEffect(()=>{
        if(guid) setGUID(guid);
        else{

        }
    },[]);

  return (
    <Box>
        <Typography variant='h2'>{getName()}</Typography>
        <Typography>{getText()}</Typography>
    </Box>
  )
}

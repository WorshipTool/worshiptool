import { Box, Typography, useTheme } from '@mui/material';
import React from 'react'
import { useOutletContext } from 'react-router-dom';
import SheetComponent from '../../Components/SheetComponent';
import Song from '../../Data/Song/Song';

interface ISheetContainerProps{
  song?: Song
}
export default function SheetContainer({song}:ISheetContainerProps) {

  const theme = useTheme();
  return (
    <Box p={theme.spacing(5)}>
        {Boolean(song)?
            <SheetComponent song={song} variant={0}/>
            :
            <Typography>No song selected or not found.</Typography>}
    </Box>
  )
}

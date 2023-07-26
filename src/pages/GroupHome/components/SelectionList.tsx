import { Box, Typography } from '@mui/material'
import React from 'react'
import useGroup from '../hooks/useGroup'
import useGroupSelection from '../hooks/useGroupSelection';
import SongListCards from '../../../components/songLists/SongListCards/SongListCards';

export default function SelectionList() {
    const {selectionGuid} = useGroup();
    const {variants} = useGroupSelection();
  return (
    <Box>
        <Typography>Písně:</Typography>
        <SongListCards variants={variants}/>
    </Box>
  )
}

import { Box, Typography } from '@mui/material'
import React from 'react'
import GroupToolbarActionButton from './GroupToolbarActionButton'
import Gap from '../../../../components/Gap'
import { Add, Search } from '@mui/icons-material'

export default function QuickActions() {
  return (
    <Box>
        <Typography fontWeight={600}>Rychlé akce</Typography>
        <Gap value={1}/>
        <Box display={"flex"} flexDirection={"row"} gap={1}>
            <GroupToolbarActionButton label='Vytvořit playlist' main icon={<Add sx={{
                strokeWidth: 2,
            }}/>} />
            <GroupToolbarActionButton label='Vyhledat píseň' icon={<Search  sx={{
                strokeWidth: 1,
            }}/>} />
            <GroupToolbarActionButton label='Přidat novou píseň' icon={<Add  sx={{
                strokeWidth: 2,
            }}/>} />
        </Box>
    </Box>
  )
}

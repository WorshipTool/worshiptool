import React from 'react'
import TransposePanel from '../TransposePanel'
import { Box } from '@mui/material'
import useAuth from '../../../hooks/auth/useAuth'
import VerifyButton from './components/VerifyButton'
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';

interface TopPanelProps {
    transpose: (i:number)=>void,
    variant: VariantDTO,
    reloadSong: ()=>void
}

export default function TopPanel(props: TopPanelProps) {

        
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
        }}>
            <TransposePanel transpose={props.transpose}/>
            <VerifyButton variant={props.variant} reloadSong={props.reloadSong}/>
        </Box>
    )
}

import React from 'react'
import TransposePanel from '../TransposePanel'
import { Box } from '@mui/material'
import useAuth from '../../../hooks/auth/useAuth'
import VerifyButton from './components/VerifyButton'
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import SheetAdminButtons from './components/SheetAdminButtons'
import { Sheet } from '@pepavlin/sheet-api'
import Song from '../../../interfaces/song/song'
import AddToPlaylistButton from './components/AddToPlaylistButton'
import PrintButton from './components/PrintButton'
import Buttons13ka from './components/Buttons13ka'

interface TopPanelProps {
    transpose: (i:number)=>void,
    variant: VariantDTO,
    reloadSong: ()=>void,
    sheet: Sheet,
    song: Song
}

export default function TopPanel(props: TopPanelProps) {

    const {isAdmin, isTrustee, isLoggedIn} = useAuth()
        
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
        }}>
            <TransposePanel transpose={props.transpose}/>
            {(isAdmin()||isTrustee())&&<>
                <VerifyButton variant={props.variant} reloadSong={props.reloadSong}/>
            </>}

            <Box flex={1}/>

            {isAdmin()&&<>
                <Buttons13ka variant={props.variant}/>
            </>}
            
            {isAdmin()&&<>
                <SheetAdminButtons sheet={props.sheet} song={props.song} reload={props.reloadSong}/>
            </>}

            {isLoggedIn()&&<>
                <AddToPlaylistButton variant={props.variant}/>
            </>}

            <PrintButton/>


        </Box>
    )
}

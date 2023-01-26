import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography, styled } from '@mui/material'
import React, { useState } from 'react'
import Gap from '../../components/Gap'
import { Masonry } from '@mui/lab'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import useSong from '../../hooks/song/useSong'
import useStack from '../../hooks/playlist/useStack'
import PanelItem from './PanelItem'


const Container = styled(Box)(({theme})=>({
    width: 300,
    backgroundColor: theme.palette.grey[200],
    position:"fixed",
    bottom:0,
    top:50,
    right:0,
    overflowY:"scroll"
}))


export default function SidePanel() {

    const {songGUIDs, setGUIDs} = useStack();  

    const [popupOpen, setPopupOpen] = useState(false);

    const closePopup = () => {
        setPopupOpen(false);
    }

    const openPopup = () => {
        setPopupOpen(true);
    }

    const onPrint = () => {
        window.print();
    }

    const removeAll = () => {
        setGUIDs([]);
        closePopup();
    }

    return (
        <Container displayPrint={"none"}>
            <Box margin={2}>
                <Box display={"flex"} flexDirection={"row"}>
                    <Typography variant='h6' fontWeight={"bold"} flex={1}>Pořadí</Typography>
                    <Button size="small" color='error' onClick={openPopup}>Odebrat vše</Button>
                </Box>
                <Gap/>
                {songGUIDs.length==0&&<>
                    <Typography variant='subtitle2'>V playlistu nejsou žádné písně...</Typography>
                </>}
                <Masonry columns={1}>
                    {songGUIDs.map((guid)=>{
                        return <PanelItem guid={guid} key={"order_"+guid}/>
                    })}
                </Masonry>
                <Gap value={6}/>
            </Box>
            
            <Button variant="contained" sx={{
                position:"fixed",
                bottom: 30,
                right: 30,
                displayPrint:"none"
            }} onClick={onPrint}>Vytisknout</Button>


            <Dialog
                open={popupOpen}
                onClose={closePopup}>
                <DialogTitle>
                    {"Opravdu chceš vyprázdnit celý playlist?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Po potvrzení budou všechny písně z playlistu odstraněny a on tak zůstane prázdný.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePopup}>Vše ponechat</Button>
                    <Button onClick={removeAll} autoFocus>
                        Odebrat vše
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    )
}

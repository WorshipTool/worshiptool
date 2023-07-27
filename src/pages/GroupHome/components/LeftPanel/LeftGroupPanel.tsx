import { Box, Button, List, ListItem, ListItemButton, ListItemText, ListSubheader, Typography } from '@mui/material'
import React from 'react'
import useGroup from '../../../../hooks/group/useGroup'
import Gap from '../../../../components/Gap';
import CreatePlaylistButton from '../CreatePlaylistButton';
import useGroupSelection from '../../../../hooks/group/useGroupSelection';
import useCurrentPlaylist from '../../../../hooks/playlist/useCurrentPlaylist';

export default function LeftGroupPanel() {
    const {name} = useGroup();
    const {count} = useGroupSelection();
    const {isOn, turnOff} = useCurrentPlaylist();

  return (
    <>
        <Box bgcolor={"#414141"} width={300} top={0} zIndex={10} bottom={0} display={"flex"} flexDirection={"column"}>
        
            <Box padding={3} color={"white"}>
                <Typography variant='h5' fontWeight={900}>Církev bratrská na Praze 13</Typography>
                <Gap value={2}/>
                <Typography variant='subtitle2'>Má v okruhu celkem {count} písní</Typography>
            </Box>
            <Box padding={1} flex={1} display={"flex"} flexDirection={"column"} justifyContent={"end"}>
                <CreatePlaylistButton/>
            </Box>
        </Box>
    </>
  )
}

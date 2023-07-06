import React from 'react'
import { GroupProvider } from './hooks/useGroup'
import { Box } from '@mui/material'
import Toolbar from '../../components/Toolbar/Toolbar'
import SideToolbar from '../../components/SideToolbar/SideToolbar'
import LeftPanel from './components/LeftPanel/LeftPanel'
import SideToolbarTitle from './components/SideToolbarTitle'

export default function GroupHome() {
  return (
    <GroupProvider>
        <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
            <Toolbar transparent/>
            <Box display={"flex"} flexDirection={"row"} flex={1} position={"absolute"} top={0} bottom={0} left={0} right={0}>
                <Box display={"flex"} sx={{
                    boxShadow: "4px 0px 8px #00000044"
                }}>
                    <SideToolbar component={<SideToolbarTitle/>}/>
                    <LeftPanel/>
                </Box>
                <Box flex={1} >
                </Box>
            </Box>

        </Box>
    </GroupProvider>
  )
}

import React, { useState } from 'react'
import { GroupProvider } from './hooks/useGroup'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import Toolbar from '../../components/Toolbar/Toolbar'
import SideToolbar from '../../components/SideToolbar/SideToolbar'
import LeftPanel from './components/LeftPanel/LeftPanel'
import SideToolbarTitle from './components/SideToolbarTitle'
import SearchBar from '../../components/SearchBar/SearchBar'
import ContainerGrid from '../../components/ContainerGrid'
import SearchedSongsList from './components/SearchedSongsList'

export default function GroupHome() {
    const theme = useTheme()

    const [searchString, setSearchString] = useState("");

    return (
        <GroupProvider>
            <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
                <Toolbar transparent/>
                <Box display={"flex"} flexDirection={"row"} flex={1} position={"absolute"} top={0} bottom={0} left={0} right={0}>
                    <Box display={"flex"} sx={{
                    }}>
                        <SideToolbar component={<SideToolbarTitle/>}>
                            <LeftPanel/>
                        </SideToolbar>

                        
                    </Box>
                    <Box flex={1}>
                        <Box margin={3} display={"flex"} flexDirection={"column"} gap={2}>
                            <Box sx={{
                                width: theme.spacing(45)
                            }}>
                                <SearchBar value={searchString} onChange={(s)=>setSearchString(s)}/>
                            </Box>
                            <SearchedSongsList searchString={searchString}/>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </GroupProvider>
    )
}

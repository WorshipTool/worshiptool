import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import Toolbar from '../../components/Toolbar/Toolbar'
import useGroup from '../../hooks/group/useGroup';
import SelectionList from './components/SelectionList';
import ContainerGrid from '../../components/ContainerGrid';
import Gap from '../../components/Gap';
import LeftGroupPanel from './components/LeftPanel/LeftGroupPanel';
import GroupToolbar from './components/GroupToolbar/GroupToolbar';
import SideToolbar from '../../components/SideToolbar/SideToolbar';

export default function GroupHome() {
    const group = useGroup();
  return (
    <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
        <Box display={"flex"} flexDirection={"row"} position={"absolute"} bottom={0} top={0} left={0} right={0} height={"100vh"} >
            {/* <LeftGroupPanel/> */}
            <SideToolbar/>
            <Box flex={1} maxWidth={"calc(100% - 56px)"} overflow={"scroll"} >
              <GroupToolbar/>
              <Box padding={5} paddingTop={0} display={"flex"} flexDirection={"column"}>
                  <SelectionList/>
              </Box>
            </Box>
        </Box >

    </Box>
  )
}

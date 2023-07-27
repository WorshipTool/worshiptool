import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import Toolbar from '../../components/Toolbar/Toolbar'
import useGroup from '../../hooks/group/useGroup';
import SelectionList from './components/SelectionList';
import ContainerGrid from '../../components/ContainerGrid';
import Gap from '../../components/Gap';
import LeftGroupPanel from './components/LeftPanel/LeftGroupPanel';

export default function GroupHome() {
    const group = useGroup();
  return (
    <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
        <Toolbar/>
        <Box display={"flex"} flexDirection={"row"} position={"absolute"} bottom={0} top={0} left={0} right={0}>
            <LeftGroupPanel/>
            <Grid container sx={{padding: 3}}marginTop={"56px"}>

                <Grid item xs={12}>
                  <SelectionList/>
                  <Gap value={2}/>
                </Grid>
            </Grid>
        </Box >

    </Box>
  )
}

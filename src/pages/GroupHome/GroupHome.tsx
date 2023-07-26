import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import Toolbar from '../../components/Toolbar/Toolbar'
import useGroup from './hooks/useGroup';
import SelectionList from './components/SelectionList';
import ContainerGrid from '../../components/ContainerGrid';
import Gap from '../../components/Gap';
import AddToSelection from './components/AddToSelection';

export default function GroupHome() {
    const group = useGroup();
  return (
    <Box display={"flex"} flexDirection={"column"} height={"100vh"} alignItems={"center"}>
        <Toolbar/>
        <ContainerGrid >
            <Grid item xs={12}>
              <Gap value={4}/>
              <Typography variant='h5' fontWeight={900}> {group.name} </Typography>
              <Gap value={2}/>
              <SelectionList/>
              <Gap value={2}/>
              <AddToSelection/>

            </Grid>
        </ContainerGrid>

    </Box>
  )
}

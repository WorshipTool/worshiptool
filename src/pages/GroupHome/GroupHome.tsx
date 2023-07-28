import { Box, Button, Grid, Select, Typography } from '@mui/material'
import React from 'react'
import Toolbar from '../../components/Toolbars/Toolbar'
import useGroup from '../../hooks/group/useGroup';
import SelectionList from './components/SelectionList';
import ContainerGrid from '../../components/ContainerGrid';
import Gap from '../../components/Gap';
import LeftGroupPanel from './components/LeftPanel/LeftGroupPanel';
import GroupToolbar from '../../components/Toolbars/GroupToolbar/GroupToolbar';
import SideToolbar from '../../components/Toolbars/SideToolbar/SideToolbar';
import OnScrollComponent from '../../components/OnScrollComponent/OnScrollComponent';
import AppContainer from '../../components/AppContainer/AppContainer';

export default function GroupHome() {
    const group = useGroup();
    // const [expand, setExpand] = React.useState<boolean>(false);
  return (
    <AppContainer expandable>
      <SelectionList/>
      {/* <Box padding={5} paddingTop={0} display={"flex"} flexDirection={"column"} sx={{
        transition:"all 0.2s ease-in-out"
      }}>
          <SelectionList/>
      </Box> */}
    </AppContainer>
  )
}

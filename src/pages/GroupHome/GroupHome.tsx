import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import Toolbar from '../../components/Toolbars/Toolbar'
import useGroup from '../../hooks/group/useGroup';
import SelectionList from './components/SelectionList';
import ContainerGrid from '../../components/ContainerGrid';
import Gap from '../../components/Gap';
import LeftGroupPanel from './components/LeftPanel/LeftGroupPanel';
import GroupToolbar from '../../components/Toolbars/GroupToolbar/GroupToolbar';
import SideToolbar from '../../components/SideToolbar/SideToolbar';
import OnScrollComponent from '../../components/OnScrollComponent/OnScrollComponent';
import AppContainer from '../../components/AppContainer/AppContainer';

export default function GroupHome() {
    const group = useGroup();
    // const [expand, setExpand] = React.useState<boolean>(false);
  return (
    <AppContainer expandable>
      <Box padding={5} paddingTop={0} display={"flex"} flexDirection={"column"}>
          <SelectionList/>
      </Box>
    </AppContainer>
    // <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
    //     <Box display={"flex"} flexDirection={"row"} position={"absolute"} bottom={0} top={0} left={0} right={0} height={"100vh"} >
    //         {/* <LeftGroupPanel/> */}
    //         <SideToolbar/>
    //         <Box flex={1} maxWidth={"calc(100% - 56px)"} >
    //           <OnScrollComponent component={(expand)=>{
    //             return <GroupToolbar expanded={expand}/>
    //           }}/>
    //           {/* <Button variant='contained' sx={{
    //             position:"absolute",
    //             left:60, bottom:4,
    //           }} onClick={()=>setExpand((a)=>!a)}>{expand?"Zmenšit":"Zvětšit"}</Button> */}
    //           <Box padding={5} paddingTop={0} display={"flex"} flexDirection={"column"}>
    //               <SelectionList/>å
    //           </Box>
    //         </Box>
    //     </Box >

    // </Box>
  )
}

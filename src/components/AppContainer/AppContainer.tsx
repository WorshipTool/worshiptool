import React from 'react'
import Toolbar from '../Toolbars/Toolbar'
import useGroup from '../../hooks/group/useGroup'
import GroupToolbar from '../Toolbars/GroupToolbar/GroupToolbar';
import GroupContainer from './components/GroupContainer';
import { Box } from '@mui/material';

interface AppContainerProps {
    children?: React.ReactNode,
    expandable?: boolean
}

export default function AppContainer({children, expandable}: AppContainerProps) {
    const {isOn} = useGroup();
  return (
    <Box >
        {!isOn ? <>
            <Toolbar/>
            {children}

        </>:<>
            <GroupContainer expandable={expandable}>
                {children}
            </GroupContainer>
        </>}
    </Box>
  )
}

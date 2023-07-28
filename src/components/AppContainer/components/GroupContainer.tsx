import React from 'react'
import GroupToolbar from '../../Toolbars/GroupToolbar/GroupToolbar'
import SideToolbar from '../../SideToolbar/SideToolbar'
import { Box } from '@mui/material'
import OnScrollComponent from '../../OnScrollComponent/OnScrollComponent'

interface GroupContainerProps {
    children?: React.ReactNode,
    expandable?: boolean
}

export default function GroupContainer({children, expandable}: GroupContainerProps) {
  return (
    <OnScrollComponent component={(top)=>{
        return <SideToolbar >
                    <Box position={"relative"} left={0} right={0}>
                        <GroupToolbar expanded={expandable&&top}/>
                        {children}
                        
                    </Box>
                </SideToolbar>
    }}/>
  )
}

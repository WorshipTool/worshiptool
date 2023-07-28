import React from 'react'
import GroupToolbar from '../../Toolbars/GroupToolbar/GroupToolbar'
import SideToolbar from '../../Toolbars/SideToolbar/SideToolbar'
import { Box } from '@mui/material'
import OnScrollComponent from '../../OnScrollComponent/OnScrollComponent'
import SideToolbar2 from '../../Toolbars/SideToolbar/SideToolbar2'

interface GroupContainerProps {
    children?: React.ReactNode,
    expandable?: boolean
}

export default function GroupContainer({children, expandable}: GroupContainerProps) {
  return (
    <OnScrollComponent component={(top)=>{
        return <Box position={"relative"} left={0} right={0}>
            <GroupToolbar expanded={expandable&&top}/>
            <SideToolbar2 >
                <>
                    {children}
                </>
            </SideToolbar2>
            
        </Box>
    }}/>
  )
}

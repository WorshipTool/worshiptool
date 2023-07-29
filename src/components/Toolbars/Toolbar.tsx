import { Box, styled, useTheme } from '@mui/material';
import { motion } from 'framer-motion'
import React from 'react'
import RightAccountPanel from './components/RightAccountPanel';
import LeftWebTitle from './components/LeftWebTItle';
import Gap from '../Gap';


const TopBar = styled(Box)(()=>({
    right:0,
    left:0,
    top:0,
    height: 56,
    minHeight: 50,
    alignItems:"center",
    display:"flex",
    displayPrint:"none",
    zIndex:10,
    pointerEvents: "none"
}))

interface ToolbarProps{
    transparent?: boolean,
    white?: boolean,
    header?: React.ReactNode
}
export default function Toolbar({transparent, white, header}:ToolbarProps) {
    const theme = useTheme();

    return (
        <>
            <TopBar  displayPrint={"none"}  position={"sticky"} zIndex={0}>
            </TopBar>
            <TopBar  displayPrint={"none"} position={"fixed"}>
                <motion.div style={{ background:`linear-gradient(70deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    position:"absolute",
                    left:0, right:0,
                    top:0, bottom:0
                    }}
                    initial={{opacity:transparent?0:1}}
                    animate={{opacity: transparent?0:1}}
                    transition={{ duration: 0.3 }}/>
    
                <Box zIndex={0} flexDirection={"row"} display={"flex"} flex={1} height={"100%"}>
                    <LeftWebTitle transparent={transparent}/>
                    <Gap horizontal value={3}/>
                    <Box sx={{
                        pointerEvents: "auto",
                        display:"flex",
                        flexDirection:"row",
                        alignItems:"center",
                    }}>
                        {header}
                    </Box>
                    <RightAccountPanel transparent={transparent&&!white}/>
                   
                </Box>
                
            </TopBar>
        </>
    )
}

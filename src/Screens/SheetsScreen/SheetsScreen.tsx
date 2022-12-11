import { AppBar, Box, styled, Toolbar, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { AnimateSharedLayout, motion, useAnimation } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SearchPanel from './Components/SearchPanel'

export default function SheetsScreen() {

    const [searchExpanded, setExpanded] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const animation = useAnimation();

    useEffect(()=>{
        if(searchExpanded){
            animation.start("expanded");
        }else{
            animation.start("collapsed");
        }
    },[searchExpanded]);


    const Bar = styled(AppBar)(({theme})=>({
        background: `linear-gradient(68deg, ${theme.palette.primary.main}, ${theme.palette.secondary.dark})`,
        boxShadow: `0px 3px 8px ${grey[500]}`
    }))

    const Sidemenu = styled(Box)(({theme})=>({
        flex:1,
        display: "flex",
        boxShadow: `0px 0px 3px ${grey[500]}`,
        position:"relative"
    }))

    const RightContainer = styled(Box)(({theme})=>({
         position:"fixed"
    }))


    const MotionSidemenu = motion(Box);
    const variants = {
        collapsed:{
             maxWidth: "20%"
        },
        expanded:{
             maxWidth: "100%"
        }
    }

    const onSearchChange = (event:any) => {
        setSearchValue(event.target.value);
        setExpanded(event.target.value!="");
    }

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"}>
            <Bar position='sticky'>
                <Toolbar variant='dense'>
                    <Typography>{searchExpanded?"true":"false"}</Typography>
                </Toolbar>
            </Bar>

            <Box display={"flex"} flex={1}>

                
            <RightContainer marginLeft={"20%"}>
                    <Typography>Rest of the page </Typography>
                </RightContainer>
                
            <motion.div variants={variants} initial={"collapsed"} animate={animation} transition={{type:"tween", duration:0.15}}
                    style={{flex:1,
                        display: "flex",
                        boxShadow: `0px 0px 3px ${grey[500]}`,
                        position:"relative"}}>
                    <SearchPanel expanded={searchExpanded} setExpanded={setExpanded} searchValue={searchValue} onSearchChange={onSearchChange}></SearchPanel>
                </motion.div>

                
                
                

            </Box>
            

        </Box>
    )
}

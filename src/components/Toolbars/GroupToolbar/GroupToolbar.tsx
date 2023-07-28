import { Box, Button, Typography, styled, useTheme } from '@mui/material'
import React, { useMemo } from 'react'
import Toolbar from '../Toolbar'
import useGroup from '../../../hooks/group/useGroup';
import Gap from '../../Gap';
import GroupToolbarActionButton from './GroupToolbarActionButton';
import QuickActions from './QuickActions';


const StyledContainer = styled(Box)(({theme})=>({
    borderRadius: "0 0 0 150px",
    userSelect: "none",
    pointerEvents: "none",

}));

interface GroupToolbarProps {
    expanded?: boolean
}

export default function GroupToolbar({expanded}: GroupToolbarProps) {
    const theme = useTheme();
    const {name} = useGroup();

    const height = useMemo(()=>{
        return expanded? "250px" : "56px"
    },[expanded])

    return (
        <>
            <Box maxWidth={"100%"} top={0} displayPrint={"none"}>
                <Toolbar transparent white/>
                <Box overflow={"hidden"} sx={{
                    position: "fixed",
                    top:0
            
                }}>
                    <StyledContainer sx={{
                        background: `linear-gradient(240deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        marginLeft: "-60px",
                        overflow: "hidden",
                        height,
                        transition: "height 0.2s ease",
                    }}>
                        <img src="/static/assets/13ka-title.svg" height={700} style={{
                            transform: "rotate(-10deg) translate(80px, -90px) scale(130%)",
                            filter: `drop-shadow(0px 4px 4px #00000060) ${expanded?"blur(0px)":"blur(20px)"}`,
                            transition: "all 0.2s ease",
                        }}/>
            
                        
                    </StyledContainer>
                    
                </Box>
                <Box sx={{
                        height,
                        color: "white",
                        position: "fixed",
                        top:0,
                        display:"flex",
                        flexDirection: "column",
                        gap:1,
                        transition: "all 0.2s ease",
                    }}>
                        <Box flex={1} display={"flex"} flexDirection={"column"} sx={{
                            ...(expanded?{
                                margin: 5,
                                marginBottom: 8
                            }:{
                                marginLeft: 5
                            }),
                            transition: "all 0.2s ease",
                        }}>
                            <Box flex={1} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                                <Typography variant='h5' fontWeight={900} sx={{
                                    transition: "all 0.2s ease",
                                    ...(expanded?{
                                    }:{
                                        fontSize: 18,
                                    })
                                }}>CB Třináctka</Typography>
                            </Box>
                            {expanded?<Box>
                                <Typography fontWeight={600}>Rychlé akce</Typography>
                                <Gap value={1}/>
                            </Box>:<></>}
            
                        </Box>
            
                        {expanded?<Box position={"absolute"} bottom={0} marginLeft={5} sx={{
                            transform: "translateY(50%)"
                        }}>
                            <QuickActions/>
                            
                        </Box>:<></>}
                </Box>
            </Box>
        </>
    )
}

import { Box, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import Toolbar from '../../../../components/Toolbar/Toolbar'
import useGroup from '../../../../hooks/group/useGroup';
import Gap from '../../../../components/Gap';
import GroupToolbarActionButton from './GroupToolbarActionButton';
import QuickActions from './QuickActions';

const height = "250px";

const StyledContainer = styled(Box)(({theme})=>({
    height: height, 
    borderRadius: "0 0 0 150px",
    userSelect: "none",
    pointerEvents: "none",
    marginTop: -56,

}));

export default function GroupToolbar() {
    const theme = useTheme();
    const {name} = useGroup();
    return (
        <Box width={"100%"} position={"sticky"} top={0}>
            <Toolbar transparent white/>
            <StyledContainer sx={{
                background: `linear-gradient(240deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                marginLeft: "-60px",
                overflow: "hidden",

            }}>
                <img src="/static/assets/13ka-title.svg" height={700} style={{
                    transform: "rotate(-10deg) translate(80px, -90px) scale(130%)",
                    filter: "drop-shadow(0px 4px 4px #00000060)",

                }}/>

                
            </StyledContainer>
            <Box sx={{
                    height,
                    color: "white",
                    position: "absolute",
                    top:0,
                    display:"flex",
                    flexDirection: "column",
                    gap:1
                }}>
                    <Box margin={5} marginBottom={8} flex={1} display={"flex"} flexDirection={"column"}>
                        <Box flex={1} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                            <Typography variant='h5' fontWeight={900}>CB Třináctka</Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={600}>Rychlé akce</Typography>
                            <Gap value={1}/>
                        </Box>

                    </Box>

                    <Box position={"absolute"} bottom={0} marginLeft={5} sx={{
                        transform: "translateY(50%)"
                    }}>
                        <QuickActions/>
                        
                    </Box>
            </Box>
        </Box>
    )
}

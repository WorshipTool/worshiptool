import { Box, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import Toolbar from '../../../../components/Toolbar/Toolbar'
import useGroup from '../../../../hooks/group/useGroup';
import Gap from '../../../../components/Gap';
import GroupToolbarActionButton from './GroupToolbarActionButton';
import QuickActions from './QuickActions';

const StyledContainer = styled(Box)(({theme})=>({
    height: "300px", 
    borderRadius: "0 0 0 100px",
    userSelect: "none",
    pointerEvents: "none",
    marginTop: -56,

}));

export default function GroupToolbar() {
    const theme = useTheme();
    const {name} = useGroup();
    return (
        <Box >
            <Toolbar transparent white/>
            <StyledContainer sx={{
                background: `linear-gradient(240deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                marginLeft: "-50px",
                overflow: "hidden",

            }}>
                <img src="/static/assets/13ka-title.svg" height={700} style={{
                    transform: "rotate(-10deg) translate(80px, -90px)",
                    filter: "drop-shadow(0px 4px 4px #00000060)"
                }}/>

                
            </StyledContainer>
            <StyledContainer>
                <Box sx={{
                    height: "300px",
                    color: "white",
                    padding: 5,
                    position: "absolute",
                    top:0
                }}>
                    <Gap value={6}/>
                    <Typography variant='h5' fontWeight={900}>CB Třináctka</Typography>
                    <Gap value={6}/>
                    <QuickActions/>
                </Box>

            </StyledContainer>
        </Box>
    )
}

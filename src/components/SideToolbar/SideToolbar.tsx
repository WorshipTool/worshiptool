import { Box, IconButton, Tooltip, styled } from '@mui/material'
import React, { ReactElement } from 'react'
import { ReactComponent as SvgIcon } from '../../assets/icon.svg'
import { useNavigate } from 'react-router-dom'
import useGroup from '../../hooks/group/useGroup'
import { ExitToApp, ExitToAppOutlined, ExitToAppRounded, ExtensionOff, Logout } from '@mui/icons-material'

const Container = styled(Box)(({theme})=>({
    width: 56,
    backgroundColor: "#2f2f2f",
    height: "100%",
    color: "white",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    
}))

const IconContainer = styled(Box)(({theme})=>({
    width: 56,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    '&:hover': {
        filter: "drop-shadow(4px 4px 4px #00000022)",
        transform: "scale(108%)"
    },
    '&:active': {
        transform: "scale(98%)"
    }
}))

interface SideToolbarProps{
    component?: ReactElement,
    children?: ReactElement
}

export default function SideToolbar({component, children}: SideToolbarProps) {

    const navigate = useNavigate();

    const {isOn, url, turnOff} = useGroup();

    const goHomeClick = () => {
        if(isOn) navigate(url);
        else navigate("/");
        window.scroll({
            top: 0,
            behavior: "smooth",
          });
    }

    const leave = () => {
        turnOff();
        if (window.location.pathname.startsWith("/group/")) navigate("/");
    }

    return (
        <>
            <Box display={"flex"} sx={{opacity:0}} bgcolor={"red"}>
                    <Container/>
                    {children}
            </Box>
            <Box sx={{
                position:"fixed",
                top: 0,
                left: 0,
                bottom: 0,
                display:"flex",
                flexDirection: "row",

                boxShadow: "4px 0px 8px #00000044",
            }}>
                <Container>
                    <IconContainer onClick={goHomeClick}>
                        <SvgIcon height={40} style={{
                            filter: " drop-shadow(1px 4px 4px #00000044)"
                        }}/>
                    </IconContainer>
                    <Box flex={1} display={'flex'} flexDirection={"column"} justifyContent={"end"} marginBottom={2} >
                        {component}
                        <Tooltip title={"Ukončit mód"} placement="right">
                            <IconButton color='secondary' onClick={leave}>
                                <ExitToApp/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                
                </Container>
                {children}
                
            </Box>
            
            
        </>
    )
}
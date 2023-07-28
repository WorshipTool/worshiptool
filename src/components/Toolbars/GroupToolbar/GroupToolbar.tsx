import { Box, Button, Collapse, Fade, Grow, Slide, Typography, Zoom, styled, useTheme } from '@mui/material'
import React, { useMemo } from 'react'
import Toolbar from '../Toolbar'
import useGroup from '../../../hooks/group/useGroup';
import Gap from '../../Gap';
import GroupToolbarActionButton from './GroupToolbarActionButton';
import QuickActions from './QuickActions';
import { ReactComponent as SvgIcon } from '../../../assets/icon.svg'
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';


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

    const navigate = useNavigate();

    const {isOn, url} = useGroup();
    const goHome = () => {
        if(isOn) navigate(url);
        else navigate("/");
        window.scroll({
            top: 0,
            behavior: "auto",
            
          });
    }

    return (
        <>
            <Box maxWidth={"100%"} top={0} displayPrint={"none"} height={height}>
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
                                margin: 3,
                                marginBottom: 8
                            }:{
                                marginLeft: 3
                            }),
                            transition: "all 0.2s ease",
                        }}>
                            <Box flex={1} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                                <ButtonComponent onClick={goHome}>
                                    <Box display={"flex"} flexDirection={"row"}  alignItems={"center"} gap={1} displayPrint={"none"}>
                                        <Zoom in={!expanded} timeout={200} >
                                                <SvgIcon fill='white' height={40} />
                                        </Zoom>
                                        <Typography variant='h5' fontWeight={900} sx={{
                                            transition: "all 0.2s ease",
                                            ...(expanded?{
                                                fontSize: 24,
                                                marginLeft: 3
                                            }:{
                                                fontSize: 18,
                                            }),
                                        }}>CB Třináctka</Typography>
                                    </Box>
                                </ButtonComponent>
                            </Box>
                            <Box sx={{
                                transition: "all 0.2s ease",
                                ...(expanded?{
                                    height: 35
                                }:{
                                    height: 0,
                                    opacity: 0,
                                    pointerEvents: "none",
                                    userSelect: "none"
                                }),
                                paddingLeft: 9
                            }}>
                                <Typography fontWeight={600}>Rychlé akce</Typography>
                                <Gap value={1}/>
                            </Box>
            
                        </Box>
                        <Fade in={expanded} >
                            <Box position={"absolute"} bottom={0} marginLeft={5} sx={{
                                transform: "translateY(50%)",
                                paddingLeft: "56px"
                            }}>
                                    <QuickActions/>
                                
                            </Box>

                        </Fade>
                </Box>
            </Box>
        </>
    )
}

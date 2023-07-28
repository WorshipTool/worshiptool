import { AddBox, Apps, HelpOutline, Login } from '@mui/icons-material'
import { Avatar, Box, Button, Chip, IconButton, SxProps, Theme, Tooltip, styled } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ToolsMenu from './Toolsmenu/ToolsMenu'
import AccountMenu from './AccountMenu'
import useAuth from '../../../hooks/auth/useAuth'
import useGroup from '../../../hooks/group/useGroup'
import GroupChip from './GroupChip'
import Gap from '../../Gap'
import usePlaylists from '../../../hooks/playlist/usePlaylists'
import { isRequestSuccess } from '../../../apis/dtos/RequestResult'

const Container = styled(Box)(({theme})=>({
    flex: 1,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: 0,
    paddingRight: theme.spacing(2)
}))

function ProfileImage({size, sx}: {size:number, sx?:SxProps<Theme>}) {
    return (
        <Box sx={{...sx}}>
            <Avatar src='/static/assets/profile-image-default.png'
                sx={{
                    width: size,
                    height: size,
                    borderColor: "inherit",
                    borderStyle: "solid",
                    borderWidth: 1.1,
                    pointerEvents: "none",
                }}
                />
        </Box>
    )
  }

interface RightAccountPanelProps{
    transparent?: boolean;
}
  
export default function RightAccountPanel({transparent}: RightAccountPanelProps) {
    const navigate = useNavigate();

    const {isLoggedIn} = useAuth();

    const {createPlaylist} = usePlaylists()

    const color = useMemo(()=>{
        return transparent? "black" : "white"
    },[transparent]);

    const shadowColor = useMemo(()=>{
        return transparent? "#ffffff44" : "#00000044"
    },[transparent])

    const iconStyle : SxProps<Theme> = {
        filter: `drop-shadow(4px 4px 2px ${shadowColor})`,
        transition: "all 0.2s ease",
        '&:hover': {
            // filter: "drop-shadow(0px 4px 4px #00000044)",
            filter: `drop-shadow(4px 4px 4px ${shadowColor})`,
            transform: "scale(110%)"
        },
        '&:active': {
            transform: "scale(98%)"
        },
        userSelect:"none"
    }

    const iconButtonStyle : SxProps = {
        marginLeft: -0.25,
        pointerEvents: "auto"
    }

    const fontSize = "medium";

    const openDocumentation = () => {
        navigate("/documentation");
    }

    const onToolsMenuClick = () => {
        setToolsOpen((o)=>!o);
    }

    const onAccountClick = (event: React.MouseEvent<HTMLElement>) => {
        setAccountMenuAnchor(event.currentTarget);
        setAccountMenuOpen(true);
    }

    const onCreatePlaylistClick = async () => {
        const result= await createPlaylist()
        if(isRequestSuccess(result)){
            navigate("/playlist/"+result.data.guid)
        }
    }

    const onLoginClick = () => {
        navigate("/login");
    }

    const [toolsOpen, setToolsOpen] = useState(false);

    const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const {isOn} = useGroup();


    return (
        <>
            <Container color={color}  >


                <Tooltip title={"Dokumentace"}>
                    <IconButton color='inherit' sx={iconButtonStyle} onClick={openDocumentation}>
                        <HelpOutline sx={iconStyle} fontSize={fontSize}/>
                    </IconButton>
                </Tooltip>

                {isLoggedIn()?<>
                    <Tooltip title={"Vytvořit playlist"}>
                        <IconButton color='inherit' sx={iconButtonStyle} onClick={onCreatePlaylistClick}>
                            <AddBox  sx={iconStyle} fontSize={fontSize}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Nástroje"}>
                        <IconButton color='inherit' sx={iconButtonStyle} onClick={onToolsMenuClick}>
                            <Apps  sx={iconStyle} fontSize={fontSize}/>
                        </IconButton>
                    </Tooltip>

                    {isOn? 
                        <GroupChip avatar={
                            <Tooltip title={"Účet"}>
                                <IconButton color='inherit' sx={iconButtonStyle} onClick={onAccountClick}>
                                    <ProfileImage size={26} sx={iconStyle}/>
                                </IconButton>
                            </Tooltip>
                        }/>
                    : 
                        <Tooltip title={"Účet"}>
                            <IconButton color='inherit' sx={iconButtonStyle} onClick={onAccountClick}>
                                <ProfileImage size={26} sx={iconStyle}/>
                            </IconButton>
                        </Tooltip>
                    }

                    <AccountMenu open={accountMenuOpen} onClose={()=>setAccountMenuOpen(false)} anchor={accountMenuAnchor}/>
                        
                    <ToolsMenu open={toolsOpen} onClose={()=>setToolsOpen(false)}/>
                </>:<>
                    <Tooltip title={"Příhlásit se"}>
                        <Button  variant='text' color='inherit' endIcon={
                            <Login sx={iconStyle} fontSize={fontSize}/>
                        } sx={{
                            transition: "all 0.2s ease",
                            ":hover": {
                                transform: "scale(102%)"
                            },
                            pointerEvents:"auto"
                        }} onClick={onLoginClick}>
                            Přihlásit se
                        </Button>
                    </Tooltip>
                </>
                }
            </Container>

        </>
  )
}

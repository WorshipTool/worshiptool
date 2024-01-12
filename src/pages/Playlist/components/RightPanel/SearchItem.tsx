import React, { useMemo, useState } from 'react'
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import { Box, Button, Divider, Skeleton, Typography, styled, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/auth/useAuth';
import Playlist from '../../../../interfaces/playlist/PlaylistDTO';
import usePlaylist from '../../../../hooks/playlist/usePlaylist';
import useCurrentPlaylist from '../../../../hooks/playlist/useCurrentPlaylist';
import useInnerPlaylist from '../../hooks/useInnerPlaylist';
import { Sheet } from '@pepavlin/sheet-api';
import { LoadingButton } from '@mui/lab';
import { useApiState } from '../../../../tech/ApiState';

const StyledContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],

    borderRadius:"0.5rem",
    "&:hover":{
        backgroundColor: theme.palette.grey[200],
        boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
    },
    cursor:"pointer",
    borderWidth:1.4,
    borderStyle: "solid"
}))

const StyledBox = styled(Typography)(({theme})=>({
    maxWidth: 'calc(100vw - 3rem)',
    overflow: "hidden"
}))

interface SearchItemProps {
    variant: VariantDTO;
    onClick?: (variant: VariantDTO)=>void,
    playlist: Playlist,
}
export default function SearchItem({variant, onClick: onClickCallback, playlist}: SearchItemProps) {
    const [bottomPanelOpen, setBottomPanelOpen] = useState(false);

    const {addVariant, reload, items} = useInnerPlaylist();

    const sheet = new Sheet(variant.sheetData);

    const {fetchApiState, apiState:{
        loading
    }} = useApiState();

    const isInPlaylist = useMemo(()=>items.some((v)=>v.variant.guid==variant.guid),[items, variant.guid]);

    const {turnOn} = useCurrentPlaylist();
    const onSongClick = () => {
        onClickCallback?.(variant);
        setBottomPanelOpen(true);
    }

    const addToPlaylist = async () => {
        turnOn(playlist.guid);
        fetchApiState(()=>{
            return addVariant(variant.guid)
        })
        
    }

    const navigate = useNavigate();

    const open = () => {
        navigate(`/song/${variant.songGuid}`)
    }
    const {user} = useAuth();
    const theme = useTheme();

  return (
    <Box>
        {false?
        <Box justifyContent={"center"} display={"flex"} flexDirection={"column"}>
            <Skeleton variant='text' width={"100%"}></Skeleton>
            {Array(2).fill(1).map((a, index)=>{
                return <Skeleton variant='text' width={Math.round(Math.random()*80)+"%"} key={variant.guid+"s"+index}></Skeleton>
            })}
        </Box>
        :
        <StyledContainer onClick={onSongClick} sx={{
            borderColor:variant.verified  || (variant.createdByLoader)?"transparent":"grey"
        }}>
            
            <Box padding={"1rem"}>
                {variant.createdBy==user?.guid&&
                    <Typography variant="subtitle2">Vytvořeno vámi.</Typography>}
                
                <Box display={"flex"}>
                    <Typography fontWeight={"bold"} flex={1}>{variant.preferredTitle}</Typography>
                    {!variant.verified?<>
                        {variant.createdByLoader?
                            <Typography variant='caption'>Nahráno programem</Typography>
                        :<>
                            <Typography variant='caption'>Neověřeno</Typography>
                        </>}
                    </>:
                    <>
                        
                    </>}
                </Box>
                
                <StyledBox>
                    {sheet.getSections()[0]?.text?.split("\n").slice(0,4).map((line, index)=>{
                        return <Typography noWrap key={"SearchItemText"+line}>{line}</Typography>
                    })}

                </StyledBox>
            </Box>

            {bottomPanelOpen && 
                <Box display={"flex"} flexDirection={"column"} >
                    <Divider/>
                    <Button variant='text' onClick={open}>Otevřít</Button>
                    <LoadingButton variant='contained' onClick={addToPlaylist} loading={loading}>
                        Přidat do playlistu
                    </LoadingButton>
                </Box>}
            
        </StyledContainer>
        }
    </Box>
  )
}

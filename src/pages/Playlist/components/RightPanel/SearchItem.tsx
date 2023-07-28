import React, { useMemo, useState } from 'react'
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import { Box, Button, Divider, Skeleton, Typography, styled, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/auth/useAuth';
import Playlist from '../../../../interfaces/playlist/playlist';
import usePlaylist from '../../../../hooks/playlist/usePlaylist';
import useCurrentPlaylist from '../../../../hooks/playlist/useCurrentPlaylist';
import { isRequestSuccess } from '../../../../apis/dtos/RequestResult';
import useInnerPlaylist from '../../hooks/useInnerPlaylist';

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

    const {addVariant, reload, variants} = useInnerPlaylist();

    const isInPlaylist = useMemo(()=>variants.some((v)=>v.guid==variant.guid),[variants, variant.guid]);

    const {turnOn} = useCurrentPlaylist();
    const onSongClick = () => {
        onClickCallback?.(variant);
        setBottomPanelOpen(true);
    }

    const addToPlaylist = async () => {
        turnOn(playlist.guid);
        const c = await addVariant(variant.guid)
        
        reload();
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
        <StyledContainer onClick={onSongClick} sx={{borderColor:
            variant.verified 
             || (variant.createdByLoader)
            ?"transparent":"grey"}}>
            
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
                    {variant.sections[0]?.text?.split("\n").slice(0,4).map((line, index)=>{
                        return <Typography noWrap key={"SearchItemText"+index}>{line}</Typography>
                    })}
                </StyledBox>
            </Box>

            {bottomPanelOpen && 
                <Box display={"flex"} flexDirection={"column"} >
                    <Divider/>
                    <Button variant='text' onClick={addToPlaylist}>Přidat do playlistu</Button>
                </Box>}
            
        </StyledContainer>
        }
    </Box>
  )
}

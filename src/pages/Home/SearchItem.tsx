import { Box, CircularProgress, Grid, Paper, Skeleton, Typography,styled, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import YouTubeIcon from '@mui/icons-material/YouTube';
import useSong from '../../hooks/song/useSong';
import { useNavigate } from 'react-router-dom'
import { Verified } from '@mui/icons-material';

const StyledContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],
    padding: "1rem",
    borderRadius:"0.5rem",
    "&:hover":{
        backgroundColor: theme.palette.grey[200],
        boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
    },
    cursor:"pointer",
    borderWidth:1.4,
    borderStyle: "solid"
}))

export default function SearchItem(props: {guid:string}) {
    const {song, getName, getText, loading, isCreatedByMe} = useSong(props.guid);

    const [verified, setVerified] = useState(false);

    const navigate = useNavigate()
    
    const onSongClick = () => {
        navigate(`/song/`+props.guid, {replace: false})
    }

    useEffect(()=>{
        if(song?.variants){
            if(song.variants.length>0){
                setVerified(song.variants[0].verified);
            }
        }
    },[song])
   

    
  return (
    
    <Box>
        {loading?
        <Box justifyContent={"center"} display={"flex"}>
            <Skeleton variant='text' width={"200"}></Skeleton>
            {Array(4).fill(1).map((a, index)=>{
                return <Skeleton variant='text' width={"100%"} key={props.guid+"s"+index}></Skeleton>
            })}
        </Box>
        :
        <StyledContainer onClick={onSongClick} sx={{borderColor:verified?"transparent":"grey"}}>
            
            {song&&isCreatedByMe(song.variants[0])&&
                <Typography variant="subtitle2">Vytvořeno vámi.</Typography>}

            <Box display={"flex"}>
                <Typography fontWeight={"bold"}>{getName()}</Typography>
                {!verified&&<Typography variant='caption'>Neověřeno</Typography>}
            </Box>

            {getText(0).split("\n").slice(0,5).map((line, index)=>{
                return <Typography noWrap key={"SearchItemText"+index}>{line}</Typography>
            })}
            
        </StyledContainer>
        }
    </Box>
  )
}

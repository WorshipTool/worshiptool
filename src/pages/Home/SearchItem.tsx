import { Box, CircularProgress, Grid, Typography,styled, useTheme } from '@mui/material';
import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import YouTubeIcon from '@mui/icons-material/YouTube';
import useSong from '../../hooks/useSong';
import { useNavigate } from 'react-router-dom'

export default function SearchItem(props: {guid:string}) {
    const theme = useTheme();

    const {interface:song, getName, getText, loading} = useSong(props.guid);

    const navigate = useNavigate()
    
    const onSongClick = () => {
        navigate(`/song/`+props.guid, { replace: false })
    }

    const StyledContainer = styled(Box)(({})=>({
        backgroundColor: theme.palette.grey[100],
        padding: "1rem",
        borderRadius:"0.5rem",
        "&:hover":{
            backgroundColor: theme.palette.grey[200],
            boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
        }
    }))
  return (
    
    <Grid item xs={1}>
        {loading?
        <Box justifyContent={"center"} display={"flex"}>
            <CircularProgress color={"inherit"} size={32}/>
        </Box>
        :
        <StyledContainer onClick={onSongClick}>
            
            
            <Typography fontWeight={"bold"}>{getName()}</Typography>
            {getText(0).split("\n").map((line)=>{
                return <Typography >{line}</Typography>
            })}
            <Box display={"flex"} justifyContent={"end"} alignItems={"center"}>
                <YouTubeIcon color={"error"} fontSize={"medium"}/>
                <VerifiedIcon color={"success"} fontSize={"medium"}/>
            </Box>
            
        </StyledContainer>
        }
    </Grid>
  )
}

import { Box, CircularProgress, Grid, Paper, Skeleton, Typography,styled, useTheme } from '@mui/material';
import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import YouTubeIcon from '@mui/icons-material/YouTube';
import useSong from '../../hooks/useSong';
import { useNavigate } from 'react-router-dom'

const StyledContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],
    padding: "1rem",
    borderRadius:"0.5rem",
    "&:hover":{
        backgroundColor: theme.palette.grey[200],
        boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
    },
    cursor:"pointer"
}))

export default function SearchItem(props: {guid:string}) {
    const {song, getName, getText, loading} = useSong(props.guid);

    const navigate = useNavigate()
    
    const onSongClick = () => {
        navigate(`/song/`+props.guid, {replace: false})
    }
   

    
  return (
    
    <Grid item xs={1}>
        {loading?
        <Box justifyContent={"center"} display={"flex"}>
            <Skeleton variant='text' width={"200"}></Skeleton>
            {Array(4).fill(1).map((a, index)=>{
                return <Skeleton variant='text' width={"100%"} key={props.guid+"s"+index}></Skeleton>
            })}
        </Box>
        :
        <StyledContainer onClick={onSongClick} >
            
            
            <Typography fontWeight={"bold"}>{getName()}</Typography>
            {getText(0).split("\n").slice(0,5).map((line, index)=>{
                return <Typography noWrap key={"SearchItemText"+index}>{line}</Typography>
            })}
            
        </StyledContainer>
        }
    </Grid>
  )
}

import { Box, CircularProgress, Grid, Paper, Skeleton, Typography,makeStyles,styled, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import useSong from '../../../hooks/song/useSong';
import { useNavigate } from 'react-router-dom'
import Song from '../../../models/song/song';
import { SearchSongDataDTO } from '../../../backend/dtos/dtosSong';
import {convertSheetToSections} from "@pepavlin/sheet-api";
import useAuth from '../../../hooks/auth/useAuth';

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

const StyledBox = styled(Typography)(({theme})=>({
    maxWidth: 'calc(100vw - 3rem)',
    overflow: "hidden"
}))


export default function SearchItem({song,sx}: {song:SearchSongDataDTO, sx?:any}) {
    //const {song, setSong, getName, getText, loading, isCreatedByMe} = useSong(null);
    const {user} = useAuth();

    const [verified, setVerified] = useState(false);

    const navigate = useNavigate()
    
    const onSongClick = () => {
        if(song) navigate(`/song/`+song.guid, {replace: false})
    }

    useEffect(()=>{
        setVerified(song.verified);
    },[song]);

    // useEffect(()=>{
    //     setSong(songObject);
    // },[songObject])
   

    
  return (
    
    <Box>
        {false?
        <Box justifyContent={"center"} display={"flex"} flexDirection={"column"}>
            <Skeleton variant='text' width={"100%"}></Skeleton>
            {Array(2).fill(1).map((a, index)=>{
                return <Skeleton variant='text' width={Math.round(Math.random()*80)+"%"} key={song?.guid+"s"+index}></Skeleton>
            })}
        </Box>
        :
        <StyledContainer onClick={onSongClick} sx={{...sx,borderColor:
            verified 
             || (song.createdByLoader)
            ?"transparent":"grey"}}>
            
            {song.createdBy==user?.guid&&
                <Typography variant="subtitle2">Vytvořeno vámi.</Typography>}

            <Box display={"flex"}>
                <Typography fontWeight={"bold"} flex={1}>{song.title}</Typography>
                {!verified?<>
                    {song.createdByLoader?
                        <Typography variant='caption'>Nahráno programem</Typography>
                    :<>
                        <Typography variant='caption'>Neověřeno</Typography>
                    </>}
                </>:
                <>
                    
                </>}
            </Box>

            <StyledBox>
                {song.sheetData&&convertSheetToSections(song.sheetData)[0]?.text?.split("\n").slice(0,4).map((line, index)=>{
                    return <Typography noWrap key={"SearchItemText"+index}>{line}</Typography>
                })}
            </StyledBox>
            
        </StyledContainer>
        }
    </Box>
  )
}

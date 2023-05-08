import { AppBar, Box, Button, IconButton, InputBase, Skeleton, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Toolbar from '../../components/Toolbar';
import YoutubeVideo from '../../components/YoutubeVideo';
import { useSnackbar } from 'notistack';
import Gap from '../../components/Gap';
import useYoutube from '../../hooks/useYoutube';
import useFetch from '../../hooks/useFetch';
import { RequestResult, isRequestSuccess } from '../../backend/dtos/RequestResult';
import { getUrl_ADDSONGDATA, getUrl_POSTMERGESONGS } from '../../backend/urls';
import { MediaTypes } from '../../models/song/media';
import { NewSongDataDTO, NewSongDataResult } from '../../backend/dtos/dtosNewSongData';
import { SongsMergeBody } from '../../backend/dtos/dtosSong';

export default function TestPage() {

    const {enqueueSnackbar} = useSnackbar();
    const [start, setStart] = useState(false);

    const {post} = useFetch();
    const [message, setMessage] = useState("");

    const input1Ref = useRef()
    const input2Ref = useRef()

    useEffect(()=>{ 
        document.title = "Testoiďák";
        setStart(true);
    },[])

    useEffect(()=>{
        if(start){            
            enqueueSnackbar("Testovací stránka pro admina.", {});
        }
    },[start])

    const onMergeClick = async () => {
        const body: SongsMergeBody = {
            //@ts-ignore
            guid1: input1Ref.current?.value,
            //@ts-ignore
            guid2: input2Ref.current?.value
        }
        const result = await post({url: getUrl_POSTMERGESONGS(), body:body});
        setMessage(result.message);
    }


    return (
        <Box>
            <Toolbar/>
            <Box padding={8} display={"flex"} flexDirection={"row"}>
                <Box display={"flex"} flexDirection={"column"} flex={1}>
                    <InputBase placeholder='Zadejte id 1' inputRef={input1Ref}/>
                    <InputBase placeholder='Zadejte id 2' inputRef={input2Ref}/>
                    <Gap/>
                    <Box>
                        <Button variant='contained' onClick={onMergeClick}>Spojit</Button>
                    </Box>
                    <Typography>{message}</Typography>

                </Box >
            </Box>
        </Box>
    )
}

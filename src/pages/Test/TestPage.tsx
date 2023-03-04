import { AppBar, Box, Button, IconButton, InputBase, Skeleton, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Toolbar from '../../components/Toolbar';
import useSongQuery from '../../hooks/song/useSongQuery';
import YoutubeVideo from '../../components/YoutubeVideo';
import { useSnackbar } from 'notistack';
import Gap from '../../components/Gap';
import useYoutube from '../../hooks/useYoutube';
import { Configuration, OpenAIApi } from "openai";
import useFetch from '../../hooks/useFetch';
import { RequestResult, isRequestSuccess } from '../../backend/dtosRequestResult';
import { getUrl_ADDSONGDATA } from '../../backend/urls';
import { MediaTypes } from '../../models/song/media';
import { NewSongDataDTO, NewSongDataResult } from '../../backend/dtosNewSongData';

export default function TestPage() {

    const {enqueueSnackbar} = useSnackbar();
    const [start, setStart] = useState(false);

    const {getEmbedUrl, getId} = useYoutube();

    const [url, setUrl] = useState<string>()

    const navigate = useNavigate();

    const {post} = useFetch();

    const inputRef = useRef()
    const someRef = useRef();

    useEffect(()=>{ 
        document.title = "Testoiďák";
        setStart(true);
    },[])

    useEffect(()=>{
        if(start){            
            enqueueSnackbar("Testovací stránka pro admina.", {});
        }
    },[start])

    const showVideo = () =>{
        //@ts-ignore
        const val = inputRef.current.value;
        const id = getId(val);
        if(id){
            const embedUrl = getEmbedUrl(id);
            setUrl(embedUrl);
        }
    }

    const uploadVideo = () => {
        //@ts-ignore
        const url = inputRef.current.value;
        const id = getId(url);
        if(id==null)return;

        const dto : Partial<NewSongDataDTO> = {
            media: [{
                type: MediaTypes.Youtube,
                url: url
            }]
        }

        post({url: getUrl_ADDSONGDATA(), body: dto}, (d:RequestResult<NewSongDataResult>)=> {
            if(isRequestSuccess(d)){
                navigate("/song/"+d.data.songGuid);
            }  
        });


    }

    return (
        <Box>
            <Toolbar/>
            <Box padding={8} display={"flex"} flexDirection={"row"}>
                <Box display={"flex"} flexDirection={"column"} flex={1}>
                    <InputBase placeholder='Zadejte url youtube videa...' inputRef={inputRef}/>
                    <Gap/>
                    <Box>
                        <Button variant='contained' onClick={showVideo}>Ukaž</Button>
                        <Button variant='contained' onClick={uploadVideo}>Nahraj</Button>
                    </Box>
                    <Gap/>
                    {url&&<YoutubeVideo src={url}/>}

                </Box >
            </Box>
        </Box>
    )
}

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import usePlaylist from '../../hooks/playlist/usePlaylist';
import { Box, IconButton } from '@mui/material';
import SlideCard from './SlideCard/SlideCard';
import { ChevronLeft, ChevronRight, Fullscreen, FullscreenExit, SwipeLeft, SwipeRight, SwitchLeft } from '@mui/icons-material';

export default function PlaylistCards() {
    const {guid} = useParams();

    const {playlist, variants, reload} = usePlaylist(guid||"");

    const [currentVariant, setCurrentVariant] = useState(0);
    
    const [fullscreen, setFullscreen] = useState(false);
    
    const COLOR = "white";

    const moveCurrent = (offset: number) => {
        setCurrentVariant((v)=>{
            const target = v + offset;
            if(target<0)return 0;
            if(target>=variants.length) return variants.length-1;
            return target;
        })
    }

    const onKeyDown = (e : any) => {
        e.preventDefault();

        if(e.code === "ArrowLeft"){
            moveCurrent(-1);
        }
        else if (e.code === "ArrowRight"){
            moveCurrent(1);
        }
    }

    useEffect(()=>{

        document.addEventListener("keydown", onKeyDown);
        return ()=>{
            document.removeEventListener("keydown", onKeyDown);
        }

    },[]);
    
    useEffect(()=>{
        document.title = "Cards from playlist";
    },[])
  return (
    <Box>

            <Box position={"absolute"} right={0} top={0} bgcolor={"grey"}>
                <IconButton  color='inherit' sx={{color: COLOR}} onClick={()=>moveCurrent(-1)} disabled={currentVariant==0}>
                    <ChevronLeft/>
                </IconButton>
                <IconButton color='inherit' sx={{color: COLOR}} onClick={()=>moveCurrent(1)} disabled={currentVariant==variants.length-1}>
                    <ChevronRight/>
                </IconButton>
                {!fullscreen?
                    <IconButton onClick={()=>{
                        document.body.requestFullscreen()
                        setFullscreen(true);
                        }}>
                        <Fullscreen color='inherit' sx={{color: COLOR}}/>
                    </IconButton>
                :
                    <IconButton onClick={()=>{
                        document.exitFullscreen();
                        setFullscreen(false);
                        }}>
                        <FullscreenExit color='inherit' sx={{color: COLOR}}/>
                    </IconButton>
                }
            </Box>
        <SlideCard guid={variants[currentVariant]} index={currentVariant}/>
    </Box>
  )
}

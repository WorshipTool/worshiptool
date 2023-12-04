import { LoadingButton, Masonry } from '@mui/lab';
import { Box, Button, CircularProgress, Grid, LinearProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import usePagination from '../../../hooks/usePagination';
import { useIsInViewport } from '../../../hooks/useIsInViewport';
import Gap from '../../../components/Gap';
import useSongSearch from '../../../hooks/song/useSongSearch';
import { SearchSongDataDTO, SongSearchResultDTO } from '../../../api/dtos/dtosSong';
import { grey } from '@mui/material/colors';
import normalizeSearchText from '../../../tech/normalizeSearchText';
import ContainerGrid from '../../../components/ContainerGrid';
import { mapApiToVariant } from '../../../api/dtos/variant/mapApiToVariant';
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import { useNavigate } from 'react-router-dom';
import OnChangeDelayer from '../../../components/ChangeDelayer';
import SongListCards from '../../../components/songLists/SongListCards/SongListCards';
import { Downloading, Sync } from '@mui/icons-material';

interface SearchedSongsListProps{
    searchString: string
}
const controller = new AbortController();

export default function SearchedSongsList({searchString} : SearchedSongsListProps) {    
    const theme = useTheme();
    const loadNextLevelRef = useRef(null);
    const isInViewport = useIsInViewport(loadNextLevelRef, "100px");

    const [loading, setLoading] = useState<boolean>(false);
    const [nextLoading, setNextLoading] = useState<boolean>(false);
    const [enableLoadNext, setEnableLoadNext] = useState<boolean>(false);

    const searchSongs = useSongSearch();
    const {nextPage: loadNext, loadPage, data: songs, nextExists} = usePagination<SearchSongDataDTO>((page, resolve, arr)=>{
        controller.abort();
        searchSongs({searchKey: searchString, page, signal: controller.signal}).then((data)=>{
            console.log("found")   
            setLoading(false);
            setNextLoading(false);
            resolve({result: data, data: data.data.songs.filter((v)=>{
                return !arr.find((s)=>s.guid==v.guid);
            })});

        })

    });

    useEffect(()=>{
        setEnableLoadNext(false);
        setLoading(true);
    },[searchString])

    useEffect(()=>{
        if(!enableLoadNext) return;
        if(!isInViewport) return;
        if(songs.length>0&&nextExists){
            setNextLoading(true);
            loadNext();
        }
    },[isInViewport])
 

    const navigate = useNavigate();

    const onCardClick = (variant: VariantDTO) => {
        navigate("/song/"+variant.songGuid, {state:{
            title: variant.preferredTitle 
        }})
    }


  return (
    <ContainerGrid direction='column'>

        <OnChangeDelayer value={normalizeSearchText(searchString)} onChange={()=>{
            setLoading(true);
            loadPage(0, true).then(()=>{
                setEnableLoadNext(true);
            })
            console.log("searching")   
        }}/>

        <>                       
            <Typography fontWeight={"bold"}>Výsledky vyhledávání:</Typography>
        
            {!loading&&songs.length>0&&<SongListCards variants={songs.map(s=>mapApiToVariant(s.variant))} onClick={onCardClick}></SongListCards>}
        </>
        
        <div ref={loadNextLevelRef}></div>

        
        {loading&&<>
            <LinearProgress sx={{color: grey[500]}} color={"inherit"}/>
        </>}
        

        <>
            {!loading&&songs.length>0&&nextExists&&<>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <LoadingButton 
                        loading={nextLoading}
                        loadingPosition='start'
                        onClick={()=>{loadNext()}}
                        startIcon={<Sync/>}>
                        Načíst další
                    </LoadingButton>
                </Box>
            </>}
        </>

        {!loading&&songs.length<1&&<>
            <Typography>Nic jsme nenašli...</Typography>            
        </>}
        

        <Gap/>

            

    </ContainerGrid>
  )
}

import { Masonry } from '@mui/lab';
import { Button, CircularProgress, Grid, LinearProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import usePagination from '../../../hooks/usePagination';
import { useIsInViewport } from '../../../hooks/useIsInViewport';
import Gap from '../../../components/Gap';
import useSongSearch from '../../../hooks/song/useSongSearch';
import { SearchSongDataDTO, SongSearchResultDTO } from '../../../backend/dtos/dtosSong';
import { grey } from '@mui/material/colors';
import normalizeSearchText from '../../../utils/normalizeSearchText';
import ContainerGrid from '../../../components/ContainerGrid';
import SearchItem from '../../Home/components/SearchItem';

interface SearchedSongsListProps{
    searchString: string
}

export default function SearchedSongsList({searchString} : SearchedSongsListProps) {    
    const theme = useTheme();
    const loadNextLevelRef = useRef(null);
    const isInViewport = useIsInViewport(loadNextLevelRef, "100px");

    const [loading, setLoading] = useState<boolean>(false);

    const searchSongs = useSongSearch();
    const {nextPage: loadNext, loadPage, data: songs, nextExists} = usePagination<SearchSongDataDTO>((page, resolve, arr)=>{
        searchSongs({searchKey: searchString, page}).then((data)=>{
            setLoading(false);
            resolve({result: data, data: data.data.songs.filter((v)=>{
                return !arr.find((s)=>s.guid==v.guid);
            })});

        })

    });

    useEffect(()=>{
        if(songs.length>0&&nextExists){
            loadNext();
        }
    },[isInViewport])

    const loadTimeoutId = useRef<ReturnType<typeof setTimeout>|undefined>(undefined);

    useEffect(()=>{
        //if(normalizeSearchText(searchString)==="") return;

        clearTimeout(loadTimeoutId.current);
        const INTERVAL = 300;
        setLoading(true);

        loadTimeoutId.current = setTimeout(()=>{
            loadPage(0, true);            
        },INTERVAL);

        return () =>  clearTimeout(loadTimeoutId.current);
    },[normalizeSearchText(searchString)])


    const spacing = 1;
  return (
    <ContainerGrid direction='column'>
        <>                       
            <Typography fontWeight={"bold"}>Výsledky vyhledávání:</Typography>
        
            {!loading&&songs.length>0&&<Masonry columns={{ xs: 1, sm: 2, md: 4 }} sx={{marginLeft: -(spacing/2), width: `calc(100% + ${theme.spacing(spacing)})`}} spacing={spacing}>
                {songs.map((song)=>{
                    return <SearchItem song={song} key={song.guid}></SearchItem>
                })}            
            </Masonry>}
        </>
        
        <div ref={loadNextLevelRef}></div>

        
        {loading&&<>
            <LinearProgress sx={{color: grey[500]}} color={"inherit"}/>
        </>}
        

        <>
            {!loading&&songs.length>0&&nextExists&&<>
                <Button onClick={()=>{loadNext()}}>Načíst další</Button>
            </>}
        </>

        {!loading&&songs.length<1&&<>
            <Typography>Nic jsme nenašli...</Typography>            
        </>}
        

        <Gap/>

            

    </ContainerGrid>
  )
}

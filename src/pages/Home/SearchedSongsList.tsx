import { Masonry } from '@mui/lab';
import { Button, CircularProgress, LinearProgress, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import SearchItem from './SearchItem';
import usePagination from '../../hooks/usePagination';
import useSongQuery from '../../hooks/song/useSongQuery';
import { useIsInViewport } from '../../hooks/useIsInViewport';
import Gap from '../../components/Gap';
import Song from '../../models/song/song';
import convertAllSongDataDTOToSong from '../../backend/api/allSongDataDTOToSong';
import useSongSearch from '../../hooks/song/useSongSearch';
import { SearchSongDataDTO, SongSearchResultDTO } from '../../backend/dtos/dtosSong';
import { grey } from '@mui/material/colors';

interface SearchedSongsListProps{
    searchString: string
}

export default function SearchedSongsList({searchString} : SearchedSongsListProps) {    
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
        clearTimeout(loadTimeoutId.current);
        const INTERVAL = 300;
        setLoading(true);

        loadTimeoutId.current = setTimeout(()=>{
            loadPage(0, true);            
        },INTERVAL);

        return () =>  clearTimeout(loadTimeoutId.current);
    },[searchString])


  return (
    <div>
        <>                       
            <Typography fontWeight={"bold"}>Výsledky vyhledávání:</Typography>
        
            {!loading&&songs.length>0&&<Masonry columns={{ xs: 1, sm: 2, md: 4 }} sx={{padding:0}} spacing={1}>
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

            

    </div>
  )
}

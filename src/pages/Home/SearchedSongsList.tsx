import { Masonry } from '@mui/lab';
import { Button, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import SearchItem from './SearchItem';
import usePagination from '../../hooks/usePagination';
import useSongQuery from '../../hooks/song/useSongQuery';
import { useIsInViewport } from '../../hooks/useIsInViewport';
import Gap from '../../components/Gap';
import Song from '../../models/song/song';
import convertAllSongDataDTOToSong from '../../backend/api/allSongDataDTOToSong';

interface SearchedSongsListProps{
    searchString: string
}

export default function SearchedSongsList({searchString} : SearchedSongsListProps) {    
    const loadNextLevelRef = useRef(null);
    const isInViewport = useIsInViewport(loadNextLevelRef, "100px");

    const searchSongs = useSongQuery({key:"search"});
    const {nextPage: loadNext, loadPage, data: songs, nextExists} = usePagination<Song>((page, resolve)=>{

        searchSongs({searchKey: searchString, page}).then((data)=>{
            const sgs : Song[] = data.data.songs.map((data)=>{
                return convertAllSongDataDTOToSong(data);
            })
            resolve({result: data, data: sgs});

        })

    });

    useEffect(()=>{
        if(nextExists){
            loadNext();
        }
    },[isInViewport])

    const [loadTimeout, setLoadTimeout] : any = useState();

    useEffect(()=>{
        clearTimeout(loadTimeout);
        const INTERVAL = 300;

        const loadTimeoutId = setTimeout(()=>{
            loadPage(0, true);            
        },INTERVAL);

        setLoadTimeout(loadTimeoutId);
    },[searchString])


  return (
    <div>
        <>                       
            <Typography fontWeight={"bold"}>Výsledky vyhledávání:</Typography>
        
            {songs.length>0&&<Masonry columns={{ xs: 1, sm: 2, md: 4 }} sx={{padding:0}} spacing={1}>
                {songs.map((song)=>{
                    return <SearchItem song={song} key={song.guid}></SearchItem>
                })}
            </Masonry>}
        </>
            
        <div ref={loadNextLevelRef}></div>
        <>
            {songs.length>0&&nextExists&&<>
                <Button onClick={()=>{loadNext()}}>Načíst další</Button>
            </>}
        </>

        {songs.length<1&&<>
            <Typography>Nic jsme nenašli...</Typography>            
        </>}
        
        <Gap/>

            

    </div>
  )
}

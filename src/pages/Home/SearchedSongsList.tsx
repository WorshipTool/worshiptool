import { Masonry } from '@mui/lab';
import { Button, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import SearchItem from './SearchItem';
import usePagination from '../../hooks/usePagination';
import useSongQuery from '../../hooks/song/useSongQuery';
import { useIsInViewport } from '../../hooks/useIsInViewport';
import Gap from '../../components/Gap';

interface SearchedSongsListProps{
    searchString: string
}

export default function SearchedSongsList({searchString} : SearchedSongsListProps) {    
    const loadNextLevelRef = useRef(null);
    const isInViewport = useIsInViewport(loadNextLevelRef, "100px");

    const searchSongs = useSongQuery({key:"search"});
    const {nextPage: loadNext, loadPage, data: songGuids, nextExists} = usePagination<string>((page, resolve)=>{

        searchSongs({searchKey: searchString, page}).then((data)=>{
            resolve({result: data, data: data.data.guids});

        })

    });

    useEffect(()=>{
        if(nextExists){
            loadNext();
        }
    },[isInViewport])

    useEffect(()=>{
        loadPage(0, true);
    },[searchString])


  return (
    <div>
        <>                       
            <Typography fontWeight={"bold"}>Výsledky vyhledávání:</Typography>
        
            {songGuids.length>0&&<Masonry columns={{ xs: 1, sm: 2, md: 4 }} sx={{padding:0}} spacing={1}>
                {songGuids.map((g)=>{
                    return <SearchItem guid={g} key={g}></SearchItem>
                })}
            </Masonry>}
        </>
            
        <div ref={loadNextLevelRef}></div>
        <>
            {songGuids.length>0&&nextExists&&<>
                <Button onClick={()=>{loadNext()}}>Načíst další</Button>
            </>}
        </>

        {songGuids.length<1&&<>
            <Typography>Nic jsme nenašli...</Typography>            
        </>}
        
        <Gap/>

            

    </div>
  )
}

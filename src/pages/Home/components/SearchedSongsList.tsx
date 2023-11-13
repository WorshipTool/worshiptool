import { Masonry } from '@mui/lab';
import { Button, CircularProgress, Grid, LinearProgress, Typography, useTheme } from '@mui/material'
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


    const spacing = 1;

    const navigate = useNavigate();

    const onCardClick = (variant: VariantDTO) => {
        navigate("/song/"+variant.songGuid)
    }
  return (
    <ContainerGrid direction='column'>

        <OnChangeDelayer value={normalizeSearchText(searchString)} onChange={()=>loadPage(0, true)}/>

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

import { Backdrop, Grid, Typography, styled } from '@mui/material'
import React, { useEffect } from 'react'
import useSongQuery from '../../hooks/song/useSongQuery';
import usePagination from '../../hooks/usePagination';
import SearchItem from './SearchItem';
import { useMachine } from '@xstate/react';
import { machine } from './machine';
import { isRequestSuccess } from '../../backend/dtos/RequestResult';
import Song from '../../models/song/song';
import convertAllSongDataDTOToSong from '../../backend/api/allSongDataDTOToSong';
import { SearchSongDataDTO } from '../../backend/dtos/dtosSong';
import Gap from '../../components/Gap';

const GridContainer = styled(Grid)(({theme})=>({
    padding:10,
    paddingTop: 5
    
}))

export default function RecommendedSongsList() {    
    const getRandomSongs = useSongQuery({key:"random"});

    const [state, send] = useMachine(machine,{
        services:{
            fetchRecommendedSongs: async ()=>{
                const res = await getRandomSongs({});
                if(!isRequestSuccess(res)){
                    throw Error(res.message);
                }
                const sgs : SearchSongDataDTO[] = res.data.songs.map((data)=>{
                    return {
                        guid: data.guid,
                        title: data.mainTitle,
                        sheetData: data.variants[0]?.sheetData,
                        createdBy: "",
                        createdByLoader: false,
                        verified:true
                    };
                })
                return sgs;
            }
        }
    });



    return (
        <div>

            {!state.matches("Error") && <Typography fontWeight={"bold"}>Nějaký nápad:</Typography>}

            {state.matches("Loading")&&<Typography>Načítání...</Typography>}

            {state.matches("Error")&&<>
            
                {/* <Typography>Při načítání se vyskytla chyba...</Typography> */}
                <Typography variant='h6' fontWeight={"300"}>Nefunguje spojení se serverem. </Typography>
                <Typography fontWeight={"bold"}>Pro odstranění této chyby, zkuste v prohlížeči povolit v nastavení webu položku "nezabezpečený obsah".</Typography>

            </>}

            <GridContainer container columns={{ xs: 1, sm: 2, md: 4 }} sx={{padding:0}} spacing={1}>
                {state.context.songs.slice(0,4).map((s)=>{
                    return <Grid item xs={1} key={"griditem_"+s.guid}>
                        <SearchItem song={s} key={s.guid} sx={{height:"7.5rem"}}></SearchItem>
                    </Grid>
                })}
            </GridContainer>

        </div>
    )
}

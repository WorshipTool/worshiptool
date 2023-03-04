import { Grid, Typography, styled } from '@mui/material'
import React, { useEffect } from 'react'
import useSongQuery from '../../hooks/song/useSongQuery';
import usePagination from '../../hooks/usePagination';
import SearchItem from './SearchItem';
import { useMachine } from '@xstate/react';
import { machine } from './machine';
import { isRequestSuccess } from '../../backend/dtosRequestResult';

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
                const data = res.data;
                return data.guids;
            }
        }
    });



    return (
        <div>
            <Typography fontWeight={"bold"}>Nějaký nápad:</Typography>

            {state.matches("Loading")&&<Typography>Načítání...</Typography>}

            {state.matches("Error")&&<Typography>Při načítání se vyskytla chyba...</Typography>}

            <GridContainer container columns={{ xs: 1, sm: 2, md: 4 }} sx={{padding:0}} spacing={1}>
                {state.context.songGuids.slice(0,4).map((g)=>{
                    return <Grid item xs={1} key={"griditem_"+g}>
                        <SearchItem guid={g} key={g} sx={{height:"7.5rem"}}></SearchItem>
                    </Grid>
                })}
            </GridContainer>

        </div>
    )
}

import {Grid, Typography, styled } from '@mui/material'
import SearchItem from '../SearchItem';
import useRecommendedSongs from './hooks/useRecommendedSongs';
import ContainerGrid from '../../../../components/ContainerGrid';

const GridContainer = styled(Grid)(({theme})=>({
    padding:10,
    paddingTop: 5
    
}))

export default function RecommendedSongsList() {    

    const {data, isLoading, isError, isSuccess} = useRecommendedSongs();



    return (
        <ContainerGrid>

            {isSuccess && <Typography fontWeight={"bold"}>Nějaký nápad:</Typography>}

            {isLoading&&<Typography>Načítání...</Typography>}

            {isError&&<>
            
                <Typography>Při načítání se vyskytla chyba...</Typography>

            </>}

            <GridContainer container columns={{ xs: 1, sm: 2, md: 4 }} sx={{padding:0}} spacing={1}>
                {data.slice(0,4).map((s)=>{
                    return <Grid item xs={1} key={"griditem_"+s.guid}>
                        <SearchItem song={s} key={s.guid} sx={{height:"7.5rem"}}></SearchItem>
                    </Grid>
                })}
            </GridContainer>

        </ContainerGrid>
    )
}

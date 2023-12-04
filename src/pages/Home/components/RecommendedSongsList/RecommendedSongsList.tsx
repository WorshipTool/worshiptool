import {Box, Button, Grid, Typography, styled } from '@mui/material'
import useRecommendedSongs from './hooks/useRecommendedSongs';
import ContainerGrid from '../../../../components/ContainerGrid';
import { useNavigate } from 'react-router-dom';
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import SongListCards from '../../../../components/songLists/SongListCards/SongListCards';

const GridContainer = styled(Grid)(({theme})=>({
    padding:10,
    paddingTop: 5
    
}))

export default function RecommendedSongsList() {    

    const {data, isLoading, isError, isSuccess} = useRecommendedSongs();


    const navigate = useNavigate();

    const onCardClick = (variant: VariantDTO) => {
        navigate("/song/"+variant.songGuid, {state:{
            title: variant.preferredTitle
        }})
    }

    const openList = () => {
        navigate("/list")
    }

    return (
        <ContainerGrid>

            {isSuccess && <Typography fontWeight={"bold"}>Nějaký nápad:</Typography>}

            {isLoading&&<Typography>Načítání...</Typography>}

            {isError&&<>
            
                <Typography>Při načítání se vyskytla chyba...</Typography>

            </>}

            <GridContainer container columns={{ xs: 1, sm: 2, md: 4 }} sx={{padding:0}}>
                <SongListCards variants={data.slice(0,4)} onClick={onCardClick}/>

            </GridContainer>

            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography variant='subtitle2'>Nebo si vyberte ze </Typography>
                <Button size='small' variant='text' onClick={openList}>Seznamu</Button>
                <Typography variant='subtitle2'>všech písní ve zpěvníku</Typography>
            </Box>

        </ContainerGrid>
    )
}

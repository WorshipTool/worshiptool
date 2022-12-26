import { Box, Button, Grid, styled, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import SheetComponent from '../../../Components/SheetComponent'
import Song from '../../../Data/Song/Song'

interface ISearchElementProps{
    song: Song,
    onClick: any
}
export default function SearchElement({song, onClick}:ISearchElementProps) {
    //const [getName] = useSong(song);
    const Border = styled(Box)(({theme})=>({
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(0.3),
        background: `linear-gradient(${song.creators.length*70+32}deg, ${theme.palette.primary.main}, ${theme.palette.warning.main})`,
    }))
    const StyledContainer = styled(Box)(({theme})=>({
        backgroundColor: "white",
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
    }))
  return (
    <Border>
        <StyledContainer>
            <Box display={"flex"}>
                <Typography fontWeight={"bold"} flex={1}>{song.name}</Typography>
                <Link to={"/"+song.guid}>
                    <Button onClick={onClick}>Click</Button>
                </Link>
            </Box>
            {(song.variants.length >0) &&
                <SheetComponent song={song} variant={0}></SheetComponent>
            }

        </StyledContainer>
    </Border>
  )
}

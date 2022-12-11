import { Box, Grid, styled, Typography } from '@mui/material'
import React from 'react'
import Song from '../../../database/Song'

interface ISearchElementProps{
    song: Song
}
export default function SearchElement({song}:ISearchElementProps) {
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
            <Typography fontWeight={"bold"}>{song.name}</Typography>
            <Typography>Tohle je text songu, je to velkej hit, ja nedokazu nemyslet na nej, bez toho abych chcip.</Typography>

        </StyledContainer>
    </Border>
  )
}

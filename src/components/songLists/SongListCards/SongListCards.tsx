import React from 'react'
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import { Masonry } from '@mui/lab';
import SearchItem from './components/SearchItem';
import { useTheme } from '@mui/material';

interface SongListCardsProps {
    variants: VariantDTO[],
    onClick?: (variant: VariantDTO)=>void
}

export default function SongListCards({variants,onClick}: SongListCardsProps) {
    const theme = useTheme();
    const spacing = 1;
    return (
      <Masonry columns={{ xs: 1, sm: 2, md: 4 }} sx={{
        marginLeft: -(spacing/2), 
        width: `calc(100% + ${theme.spacing(spacing)})`}} spacing={spacing}>
          {variants.map((v)=>{
              return <SearchItem variant={v} key={v.guid} onClick={onClick}></SearchItem>
          })}            
      </Masonry>
  )
}

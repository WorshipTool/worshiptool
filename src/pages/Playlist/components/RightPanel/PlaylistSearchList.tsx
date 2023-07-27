import React from 'react'
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import { Masonry } from '@mui/lab';
import SearchItem from '../../../../components/songLists/SongListCards/SearchItem';
import { useTheme } from '@mui/material';

interface SongListCardsProps {
    variants: VariantDTO[]
}

export default function PlaylistSearchList({variants}: SongListCardsProps) {
    const theme = useTheme();
    const spacing = 1;
    return ( variants.length===0 ? <></> :
      <Masonry columns={1} sx={{
        marginLeft: -(spacing/2), 
        width: `calc(100% + ${theme.spacing(spacing)})`}} spacing={spacing}>
          {variants.map((v)=>{
              return <SearchItem variant={v} key={v.guid} ></SearchItem>
          })}            
      </Masonry>
  )
}

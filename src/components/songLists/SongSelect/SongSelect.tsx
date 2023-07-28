import React, { useEffect, useRef } from 'react'
import { VariantDTO } from '../../../interfaces/variant/VariantDTO'
import useSongSearch from '../../../hooks/song/useSongSearch'
import { Box, Button, InputBase, TextField, Typography } from '@mui/material';
import normalizeSearchText from '../../../tech/normalizeSearchText';
import { mapApiToVariant } from '../../../apis/dtos/variant/mapApiToVariant';
import OnChangeDelayer from '../../ChangeDelayer';
import SongListCards from '../SongListCards/SongListCards';

interface SongSelectProps {
  onChange?: (a:VariantDTO|null) => void,
  filter?: (a:VariantDTO) => boolean
}

export default function SongSelect({onChange, filter}: SongSelectProps) {
    const search = useSongSearch();
    const [value, setValue] = React.useState<string>('');

    const [data, setData] = React.useState<VariantDTO[]>([]);

    const [open, setOpen] = React.useState(false);

    const [chosen, setChosen] = React.useState<VariantDTO|undefined>(undefined);


    const searchCallback = ()=>{
      search({searchKey: value, page: 0}).then((data)=>{
        const d = data.data.songs
                  .map((s)=>mapApiToVariant(s.variant))
                  .filter((v)=>filter?filter(v):true);
        setData(d);
        setOpen(data.data.songs.length>0);
      })
    }



  const onSongClick = (variant: VariantDTO) => {
    setChosen(variant);
    onChange?.(variant);
    setOpen(false);
  }

  const onEmptyClick = () => {
    setChosen(undefined);
    onChange?.(null);
    
  }

  return (
    <Box>
      <OnChangeDelayer value={normalizeSearchText(value)} onChange={searchCallback}/>

      <TextField value={value} onChange={(e)=>setValue(e.target.value)}
          variant='outlined' onFocus={()=>setOpen(data.length>0)}/>

      <Button onClick={onEmptyClick}>Smazat</Button>
      {data.length>0 ? <>
        {chosen ? <Typography>Zvoleno: {chosen?.preferredTitle}</Typography>
      :<Typography>Není zvoleno</Typography>}
      </>: <>
        <Typography>Nic jsme nenašli</Typography>
      </>}
      

      {open&&<SongListCards variants={data} onClick={onSongClick}/>}
    </Box>
  )
}

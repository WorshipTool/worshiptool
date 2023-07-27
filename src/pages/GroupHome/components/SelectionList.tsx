import { Box, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import SearchBar from '../../../components/SearchBar/SearchBar';
import Gap from '../../../components/Gap';
import OnChangeDelayer from '../../../components/ChangeDelayer';
import normalizeSearchText from '../../../tech/normalizeSearchText';
import useGroupSelection from '../../../hooks/group/useGroupSelection';
import SongListCards from '../../../components/songLists/SongListCards/SongListCards';

export default function SelectionList() {
    const {variants, search, reload} = useGroupSelection();
    
    const navigate = useNavigate();

    const onCardClick = (variant: VariantDTO) => {
        navigate("/song/"+variant.songGuid)
    }

    const [searchString, setSearchString] = React.useState<string>("");

    const onChange = (searchString: string) => {
      if(searchString==="") reload()
      else search(searchString);
    };
    
    return (
      <Box>
        <OnChangeDelayer value={normalizeSearchText(searchString)} onChange={onChange}/>

        <Box display={"flex"} flexDirection={"row"} justifyContent={"end"}>
          <Box width={350}>
            <SearchBar onChange={(s)=>setSearchString(s)}/>
          </Box>
        </Box>
        <Gap/>
          <SongListCards variants={variants} onClick={onCardClick}/>
      </Box>
    )
}

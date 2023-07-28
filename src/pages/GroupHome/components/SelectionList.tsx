import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
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
    const [stillString, setStillString] = useState<string>("");

    const onChange = (searchString: string) => {
      if(searchString==="") reload()
      else search(searchString);

      setStillString(searchString);
    };
    
    return (
      <Box>
          <OnChangeDelayer value={normalizeSearchText(searchString)} onChange={onChange}/>

          <Gap value={2}/>
          <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} position={"sticky"} top={68}
              sx={{
                pointerEvents:"none",
                
                }}>
            <Box width={350} sx={{pointerEvents:"auto"}}>
              <SearchBar onChange={(s)=>setSearchString(s)}/>
            </Box>
          </Box>
          <Gap value={2}/>
          <SongListCards variants={variants} onClick={onCardClick}/>
          {variants.length==0&&<Typography>Nebyli nalezeny žádné písně s výrazem "{stillString}"</Typography>}
      </Box>
    )
}

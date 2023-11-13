import { Box } from '@mui/material';
import React, { ReactElement, useState } from 'react'
import OnChangeDelayer from '../../ChangeDelayer';
import useSongSearch from '../../../hooks/song/useSongSearch';
import { mapApiToVariant } from '../../../api/dtos/variant/mapApiToVariant';
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import useGroup from '../../../hooks/group/useGroup';
import useGroupSelection from '../../../hooks/group/useGroupSelection';
import normalizeSearchText from '../../../tech/normalizeSearchText';

type SongSearchMethod = "all"|"group";

interface SongSearchProps{
    searchString: string,
    method?: SongSearchMethod,
    component: (variants: VariantDTO[], searchString: string)=>ReactElement
}

export default function SongSearch({searchString, method = "group", component } : SongSearchProps) {
    const search = useSongSearch();
    const {isOn} = useGroup();
    const {items: groupItems, search: searchInSelection} = useGroupSelection();
    const [variants, setVariants] = React.useState<VariantDTO[]>([]);

    const [stillString, setStillString] = useState("");



    const onChangeCallback = () => {
        if(method === "group" && isOn){
            searchInSelection(searchString)
        }else{
            search({
                searchKey: searchString, 
                page: 0
            }).then((data)=>{
                const d = data.data.songs
                          .map((s)=>mapApiToVariant(s.variant));
                setVariants(d);
              })
        }

        setStillString(searchString)
        
    }
  return (
    <Box>
        <OnChangeDelayer value={normalizeSearchText(searchString)} onChange={onChangeCallback}/>
        {component(!isOn? variants : groupItems.map(v=>v.variant), stillString)}
    </Box>
  )
}

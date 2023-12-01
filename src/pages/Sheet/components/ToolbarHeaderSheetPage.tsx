import { Box, Button, ButtonGroup } from '@mui/material'
import React, { useMemo } from 'react'
import useCurrentPlaylist from '../../../hooks/playlist/useCurrentPlaylist';
import useGroup from '../../../hooks/group/useGroup';
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import { useNavigate } from 'react-router-dom';
import { isRequestError } from '../../../api/dtos/RequestResult';

interface ToolbarHeaderSheetPageProps {
    variant: VariantDTO
}

export default function ToolbarHeaderSheetPage(props: ToolbarHeaderSheetPageProps) {
    const navigate = useNavigate();

    const {isOn} = useGroup();
    const currentPlaylist = useCurrentPlaylist();
    const isInCurrentPlaylist = useMemo(()=>{
        return currentPlaylist?.items.some((v)=>v.variant.guid===props.variant.guid);
    },[currentPlaylist]);

    
  const addToCurrentPlaylist = () => {
      currentPlaylist.addVariant(props.variant.guid).then((d)=>{
        if(isRequestError(d)){
          currentPlaylist.reload();
        }
      });
  }
  const removeFromCurrentPlaylist = () => {
      currentPlaylist.removeVariant(props.variant.guid).then((d)=>{
        if(isRequestError(d)){
          currentPlaylist.reload();
        }
      });
  }
    
  const openPlaylist = () => {
      navigate("/playlist/"+currentPlaylist.guid);
  }

    return (
        <Box display={"flex"} flexDirection={"row"}>
            {currentPlaylist.isOn&&isOn&&<>
                <ButtonGroup >
                <Button  color='secondary' size='small' variant='contained' onClick={openPlaylist}>Otevřít playlist</Button>
                {isInCurrentPlaylist?<>
                    <Button color='error' variant='contained' size='small' onClick={removeFromCurrentPlaylist}>Odebrat z playlistu</Button>
                </>:<>
                    <Button color='secondary' size='small' onClick={addToCurrentPlaylist}>Přidat do playlistu</Button>
                </>}
                </ButtonGroup>
            
            </>}
        </Box>
    )
}

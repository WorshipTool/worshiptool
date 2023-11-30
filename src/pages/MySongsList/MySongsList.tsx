import React from 'react'
import AppContainer from '../../components/AppContainer/AppContainer'
import { Box, Typography } from '@mui/material'
import useMySongs from './hooks/useMySongs'
import MySongItem from './components/MySongItem';
import Gap from '../../components/Gap';
import { useNavigate } from 'react-router-dom';

export default function MySongsList() {
    const {variants} = useMySongs();
    const navigate = useNavigate();
  return (
    <AppContainer>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Box sx={{
                width: 500,
                marginTop: 5,
                marginBottom: 5,
            }}>
                <Typography  variant="h5" fontWeight={600} >Moje písně:</Typography>
                <Gap value={2}/>
                {variants.map((variant, index)=>{
                    return <MySongItem variant={variant} index={index} key={`mysong${variant.guid}`} onClick={()=>{
                        if(variant.songGuid) navigate("/song/"+variant.songGuid);
                    }}></MySongItem>
                })}
            </Box>
        </Box>
    </AppContainer>
  )
}

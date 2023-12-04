import React from 'react'
import AppContainer from '../../components/AppContainer/AppContainer'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import useMySongs from './hooks/useMySongs'
import MySongItem from './components/MySongItem';
import Gap from '../../components/Gap';
import { useNavigate } from 'react-router-dom';

export default function MySongsList() {
    const {variants, loaded} = useMySongs();
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
                {!loaded ? <Box sx={{
                    display:"flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flex:1,
                    color: "black"
                }}>
                    <Typography>Načítání...</Typography>
                    <Gap value={2} horizontal/>
                    <CircularProgress size={"2rem"} color='inherit'/> 
                </Box>:
                    <>
                        {variants.map((variant, index)=>{
                            return <MySongItem variant={variant} index={index} key={`mysong${variant.guid}`} onClick={()=>{
                                if(variant.songGuid) navigate("/song/"+variant.songGuid);
                            }}></MySongItem>
                        })}

                        {variants.length==0&&<Box sx={{
                            display:"flex",
                            flexDirection:"row",
                            alignItems:"center",
                            gap: 2
                        }}>
                            <Typography>Nemáš žádné vytvořené písně.</Typography>
                            <Button onClick={()=>{
                                navigate("/add");
                            }} variant='contained'>Vytvořit</Button>
                        </Box>}
                    </>
                }
            </Box>
        </Box>
    </AppContainer>
  )
}

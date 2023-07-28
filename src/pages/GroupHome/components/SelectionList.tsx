import { Box, Fade, Grid, Grow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import SearchBar from '../../../components/SearchBar/SearchBar';
import Gap from '../../../components/Gap';
import OnChangeDelayer from '../../../components/ChangeDelayer';
import normalizeSearchText from '../../../tech/normalizeSearchText';
import useGroupSelection from '../../../hooks/group/useGroupSelection';
import SongListCards from '../../../components/songLists/SongListCards/SongListCards';
import ContainerGrid from '../../../components/ContainerGrid';
import OnScrollComponent from '../../../components/OnScrollComponent/OnScrollComponent';

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

    useEffect(()=>{
        const onFocus = () => {
          window.scrollTo(0,10);
        }
        window.addEventListener("searchBarFocus", onFocus);
        return ()=>{
            window.removeEventListener("searchBarFocus", onFocus);
        }

    },[])
    
    return (
      <OnScrollComponent component={(top)=>{
        return (
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"} sx={{
            transition:"all 0.3s ease",
            ...(top?{
              paddingTop: 8,
            }:{
            }),
            minHeight: "calc(100vh - 56px + 15px)",
            paddingX: 5
          }}>
              <OnChangeDelayer value={normalizeSearchText(searchString)} onChange={onChange}/>
              
              
              <Grow in={!top} timeout={top?100: 300}>
                <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} 
                    sx={{
                      pointerEvents:"none",
                      position: "fixed",
                      top: 28,
                      zIndex: 1,
                      // left:0, right:0,
                      display:"flex",
                      flexDirection:"row",
                      justifyContent:"center",
                      }}>
                  <Box width={350} sx={{pointerEvents:"auto"}}>
                    <SearchBar onChange={(s)=>setSearchString(s)} sx={{
                    }}/>
                  </Box>
                </Box>
              </Grow>
              <Gap value={4}/>
              <SongListCards variants={variants} onClick={onCardClick}/>
              {variants.length==0&&<Typography>Nebyli nalezeny žádné písně s výrazem "{stillString}"</Typography>}
          </Box>
        )
      }}/>
    )
}

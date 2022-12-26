import { alpha, Button, Grid, IconButton, styled, Typography, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Box } from '@mui/system'
import { motion, MotionConfig } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import Song from '../../../Data/Song/Song'
import { searchSongs } from '../../../Data/DataManager'
import SearchElement from './SearchElement'
import SearchInput from './SearchInput'
import "./SearchPanel.css"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ISearchPanelProps {
  expanded: boolean,
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
  searchValue: string,
  onSearchChange: any
}

export default function SearchPanel({expanded, setExpanded, searchValue, onSearchChange}:ISearchPanelProps) {
  const theme = useTheme();
  
  const variants = {
    collapsed:{
      backgroundColor: grey[100],
      backdropFilter: "blur(0px)"
    },
    expanded:{
       backgroundColor: alpha(grey[100],0.8),
      backdropFilter: "blur(5px)"
    }
    
  }

  const [songs, setSongs] = useState<Song[]>([]);
  

  useEffect(()=>{
    const a = async () => {
      setSongs(await searchSongs(searchValue))
    }
    a();
  },[searchValue]);


  const escFunction = useCallback((event: any) => {
    if (event.key === "Escape") {
      setExpanded(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const onInputFocus = () => {
    setExpanded(true);
  }

  const onBackClick = () => {    
     setExpanded(false);
  }

  const onSongSelect = () => {
    setExpanded(false);
  }

  const expandedInputPadding = "20%";

  const IconButtonWrapper = styled(Box)(({theme})=>({
    display:"flex",
    alignItems:"center",
    padding: theme.spacing(0,2)
}))

  return (
    <motion.div variants={variants} initial={"collapsed"} animate={expanded?"expanded":"collapsed"} style={{flex:1,  padding: theme.spacing(2), display: "flex", flexDirection:"column"}}>

      <Box style={{display:"flex", justifyContent:"center", position:"sticky", paddingLeft: expanded?expandedInputPadding:0, paddingRight: expanded?expandedInputPadding:0}} marginBottom={theme.spacing(0.5)}>
          {expanded&&
          <IconButtonWrapper >
            <IconButton onClick={onBackClick}>
              <ArrowBackIcon/>
            </IconButton>
          </IconButtonWrapper>}
        <SearchInput value={searchValue} onChange={onSearchChange} key={"SearchInput"} onFocus={onInputFocus}></SearchInput>
      </Box>

    <Box flex={1} position={"relative"}>
      <Box sx={{overflowY:"scroll", overflowX:"hidden"}} className="hiddenScroll" position={"absolute"} top={0} bottom={0} right={0} left={0} paddingTop={theme.spacing(2.5)}>
          <Grid id="searchGrid" container spacing={3} justifyContent={"center"}>
            {songs.map((song, index)=>{
              return (
                expanded?
                <Grid item justifyContent={"center"} key={index+"_song"} xs>
                  <Box justifyContent={"center"} alignItems={"center"} display={"flex"}>
                    <SearchElement song={song} onClick={onSongSelect}/>
                  </Box>
                </Grid>
                : <></>
                // <Grid item justifyContent={"center"} key={index+"_song"} columns={1}>
                //   <Box justifyContent={"center"} alignItems={"center"} display={"flex"}>
                //     <SearchElement song={song} onClick={onSongSelect}/>
                //   </Box>
                // </Grid>
              )
            })}

            {songs.length<1&&expanded&&(
              <Grid item xs justifyContent={"center"} key={"notfoundtext"}>    
                <Box justifyContent={"center"} alignItems={"center"} display={"flex"}>
                  <Typography>Nothing to show.</Typography>
                </Box>      
                
              </Grid>
            )}
            
          </Grid>
        </Box>
      </Box>
      
      
      
      


    </motion.div>

  )
}

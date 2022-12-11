import { alpha, Button, Grid, Typography, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Box } from '@mui/system'
import { motion, MotionConfig } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import Song from '../../../database/Song'
import { SearchSongs } from '../../../DataManager'
import SearchElement from './SearchElement'
import SearchInput from './SearchInput'

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
      setSongs(await SearchSongs())
    }
    a();
  },[])

  const expandedInputPadding = "20%";

  return (
    <motion.div variants={variants} initial={"collapsed"} animate={expanded?"expanded":"collapsed"} style={{flex:1,  padding: theme.spacing(2)}} >

      <Box style={{display:"flex", justifyContent:"center", position:"sticky", paddingLeft: expanded?expandedInputPadding:0, paddingRight: expanded?expandedInputPadding:0}} marginBottom={theme.spacing(2)}>
        <SearchInput value={searchValue} onChange={onSearchChange} key={"SearchInput"}></SearchInput>
      </Box>

      <Grid container spacing={3} justifyContent={"center"}>
        {songs.map((song, index)=>{
          return (
            expanded?
            <Grid item justifyContent={"center"} key={index+"_song"} xs>
              <Box justifyContent={"center"} alignItems={"center"} display={"flex"}>
                <SearchElement song={song}/>
              </Box>
            </Grid>
            :
            <Grid item justifyContent={"center"} key={index+"_song"} columns={1}>
              <Box justifyContent={"center"} alignItems={"center"} display={"flex"}>
                <SearchElement song={song}/>
              </Box>
            </Grid>
          )
        })}

        {songs.length<1&&(
          <Grid item xs justifyContent={"center"} key={"notfoundtext"}>    
            <Box justifyContent={"center"} alignItems={"center"} display={"flex"}>
              <Typography>Nothing to show.</Typography>
            </Box>      
            
          </Grid>
        )}
        
      </Grid>
      
      


    </motion.div>

  )
}

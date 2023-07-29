import { Box, Button, InputBase, styled, useTheme } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SearchedSongsList from './components/SearchedSongsList';
import RecommendedSongsList from './components/RecommendedSongsList/RecommendedSongsList';
import Toolbar from '../../components/Toolbars/Toolbar';
import { useNavigate } from 'react-router-dom';

const SearchContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],
    padding: "0.5rem",
    paddingLeft:"0.8rem",
    paddingRight:"0.8rem",
    borderRadius: "0.5rem",
    display:"flex",
    
    justifyContent:"center",
    alignItems:"center",

}))
const SearchInput = styled(InputBase)(({theme})=>({
    flex:1,
    marginLeft:"0.5em",
    zIndex:100
}))

export default function HomeMobile() {
    const theme = useTheme();

    const [searchValue, setSearchValue] = useState("");
    const [showSearchedList, setShowSearchedList] = useState(false);

    
    const onSearchValueChange = (event: any) => {
        setShowSearchedList(true);
        setSearchValue(event.target.value);
    }   


    
  return (
    <Box sx={{display:"none", flex:1, justifyContent:"center", alignItems:"start", flexDirection:"column",
    [theme.breakpoints.down('sm')]: {
        display:"flex"
    }}}>
        <Toolbar/>
     <Box sx={{display:"flex", width:"100%", flexDirection: "row", position:"fixed", top:56}}>
        <Box sx={{flex:1, margin:1}}>
            <SearchContainer sx={{boxShadow: "0px 4px 5px" + theme.palette.grey[400]}}>                    
               <SearchIcon />
               <SearchInput placeholder='Hledej...' onChange={onSearchValueChange} autoFocus value={searchValue}></SearchInput>
               
            </SearchContainer>
        </Box>
     </Box>


     <Box sx={{height:60}}></Box>


    <Box margin={1}>
        {showSearchedList&&<SearchedSongsList searchString={searchValue}/>}                           
        
        <RecommendedSongsList/>
    </Box >
</Box>
  )
}

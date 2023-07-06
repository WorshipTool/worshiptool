import { Box, InputBase, styled } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';


const SearchContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],
    padding: "0.5rem",
    paddingLeft:"0.8rem",
    paddingRight:"0.8rem",
    borderRadius: "0.5rem",
    display:"flex",
    
    justifyContent:"center",
    alignItems:"center",
    boxShadow: "1px 4px 4px #00000022"

}))
const SearchInput = styled(InputBase)(({theme})=>({
    flex:1,
    marginLeft:"0.5em"
}))

interface SearchBarProps{
    value?: string,
    onChange?: (value:string)=>void
}

export default function SearchBar({value, onChange}: SearchBarProps) {
    const onChangeHandler = (e: any) => {
        onChange&&onChange(e.target.value);
    }

  return (
    <SearchContainer>                    
        <SearchIcon />
        <SearchInput placeholder='Vyhledej píseň...'  autoFocus value={value} onChange={onChangeHandler} ></SearchInput>
    </SearchContainer>
  )
}

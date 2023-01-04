import { Box, Grid, InputBase, TextField, Typography, styled, useTheme } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SearchItem from './SearchItem';
import sheepImage from '../../assets/sheepWithCircle.png'

export default function Home() {
    const theme = useTheme();

    const [searchValue, setSearchValue] = useState("");
    const [searching, setSearching] = useState(false);

    const [songGUIDs, setSongGUIDs] = useState<string[]>(["f35dc172-fa9d-472a-84c0-20ad2f82dba0"]);


    const onSearchValueChange = (event: any) => {
        setSearching(true);
        setSearchValue(event.target.value);
    }   



    const AligningContainer = styled(Box)(({})=>({
        display: "flex",
        justifyContent:"center",
        position: "sticky",
        top:0,
        [theme.breakpoints.down('md')]: {
            flexDirection:"column",
        },
        [theme.breakpoints.up('md')]: {
            flexDirection:"row",
        },
        width:"100%"
    }))

    const SearchContainer = styled(Box)(({})=>({
        backgroundColor: theme.palette.grey[100],
        padding: "0.5rem",
        paddingLeft:"0.8rem",
        paddingRight:"0.8rem",
        borderRadius: "0.5rem",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        boxShadow: `0px 3px 4px ${theme.palette.grey[500]}`,
        [theme.breakpoints.down('md')]: {
            flex:1,
        },
        [theme.breakpoints.up('md')]: {
            width: "50%",
        },
        margin: "0.5rem",
        borderColor: theme.palette.grey[300]

    }))
    const SearchInput = styled(InputBase)(({})=>({
        flex:1,
        marginLeft:"0.5em"
    }))

    const GridContainer = styled(Grid)(({})=>({
        padding:10,
        paddingTop: 5
        
    }))

        

    return (
        <Box sx={{flex:1, justifyContent:"center", height:(searching?"auto":"100vh"), alignItems:"center", display:"flex", flexDirection:"column"}}>

            {!searching&&<Box sx={{alignItems:"center", justifyContent:"center", display:"flex", marginBottom:-1}}>
                <img src={sheepImage} width={200}/>
            </Box>}

            <AligningContainer>
                <SearchContainer>
                    <SearchIcon />
                    <SearchInput placeholder='Hledej...' onChange={onSearchValueChange} autoFocus value={searchValue}></SearchInput>
                    <MenuIcon/>
                </SearchContainer>
            </AligningContainer>

            {!searching&&
                <Box sx={{height:100}}>
                </Box>
            }

            {searching&&
                <GridContainer container columns={{ xs: 1, sm: 2, md: 4 }} spacing={1}>
                    {songGUIDs.map((value, index)=>{
                        return <SearchItem guid={value} key={value}></SearchItem>
                    })}
                    
                    
                </GridContainer>
            }
       
        </Box>
    )
}

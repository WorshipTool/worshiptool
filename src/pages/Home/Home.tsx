import { Box, Grid, InputBase, TextField, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SearchItem from './SearchItem';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Home() {
    const theme = useTheme();

    const AligningContainer = styled(Box)(({})=>({
        display: "flex",
        justifyContent:"center",
        position: "fixed",
        right:0,
        [theme.breakpoints.down('md')]: {
            flexDirection:"column",
            left:0,
        },
        [theme.breakpoints.up('md')]: {
            flexDirection:"row",
            left:"3.5rem",
        },
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
        [theme.breakpoints.down('md')]: {
            marginTop:"3rem",
        },
        [theme.breakpoints.up('md')]: {
            marginTop:"3rem",
        },
        
    }))
        

    const tempArr = [0,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9]

    return (
        <Box>
            <AligningContainer>
                <SearchContainer>
                    <SearchIcon />
                    <SearchInput placeholder='Hledej...'></SearchInput>
                    <MenuIcon/>
                </SearchContainer>
            </AligningContainer>
            
            <GridContainer container columns={{ xs: 1, sm: 2, md: 4 }} spacing={1}>
                {tempArr.map((value)=>{
                    return <SearchItem text={value+""}></SearchItem>
                })}
                
                
            </GridContainer>
        </Box>
    )
}

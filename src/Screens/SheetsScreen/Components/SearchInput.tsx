import { alpha, Box, Button, Input, InputBase, styled, Typography, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';

interface ISearchInputProps{
    value:string,
    onChange: any,
    onFocus?: any
}

export default function SearchInput({value, onChange, onFocus}:ISearchInputProps) {


    const SearchIconWrapper = styled(Box)(({theme})=>({
        display:"flex",
        alignItems:"center",
        padding: theme.spacing(0,2)
    }))
    
    const theme = useTheme();
    return (
        <Box sx={{
            backgroundColor: alpha(theme.palette.common.white,0.9),
            '&:hover':{
                backgroundColor: alpha(theme.palette.common.white,1),
                boxShadow: `0px 2px 6px ${grey[500]}`
            },
            boxShadow: `0px 2px 5px ${grey[500]}`,
            borderRadius: theme.shape.borderRadius +"px",
            display: "flex",
            width: "100%"}}>

            <InputBase value={value} onChange={onChange} placeholder='Hleďte něco najít...' key={"SearchInputBase0"} onFocus={onFocus}
                sx={{
                    padding:"5px",
                    paddingLeft:"10px",
                    flex: 1}}/>

            <SearchIconWrapper>
                <SearchIcon/>
            </SearchIconWrapper>
            
        </Box>
    )
}

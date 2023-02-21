import { Add, Remove } from '@mui/icons-material';
import { Box, Button, IconButton, Typography, alpha, styled } from '@mui/material';
import React from 'react'
import Gap from '../../components/Gap';

const StyledButton = styled(IconButton)(({theme})=>({
    color:"black",
    
}))

const Container = styled(Box)(({theme})=>({
    borderRadius:8,
    padding:2,
    paddingLeft:10,
    boxShadow: `0px 0px 6px ${alpha(theme.palette.grey[400],0.8)}`,
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center"
}))

export default function TransposePanel({transpose}:{transpose:(i:number)=>void}) {
  return (
    <Container>
        <Typography variant='subtitle2' fontWeight={"400"}>TRANSPOZICE</Typography>
        <Gap horizontal value={0.5}/>
        <StyledButton onClick={()=>{
            transpose(1);
        }} size='small'>
            <Add/>
        </StyledButton>
        <StyledButton onClick={()=>{
            transpose(-1);
        }} size='small'>
            <Remove/>
        </StyledButton>
    </Container>
  )
}

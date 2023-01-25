import React from 'react'
import useSong from '../../hooks/useSong';
import { Box, Button, Card, Typography, styled } from '@mui/material';

const Container = styled(Card)(({theme})=>({
    padding: 10,
    margin:2,
    height: 70
}))
export default function PlaylistItem({guid, index, onRemove}:{guid:string, index:number, onRemove: ()=>void}){
    const {getName} = useSong(guid);

    const remove = () => {
        const c = localStorage.getItem("playlist");
        let arr : string[] = [];
        if(c!=null) arr = JSON.parse(c);

        const newArr = arr.filter((v, i)=>i!=index);
        localStorage.setItem("playlist", JSON.stringify(newArr));

        onRemove();
    }

    return <Container>
        <Typography variant={"subtitle2"}>{getName()}</Typography>
        <Button onClick={remove}>Odstranit</Button>
    </Container>
}

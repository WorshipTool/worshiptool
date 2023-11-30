import React from 'react'
import { VariantDTO } from '../../../interfaces/variant/VariantDTO'
import { Box, Button, Paper, Typography } from '@mui/material'
import Gap from '../../../components/Gap';
import { useNavigate } from 'react-router-dom';

interface MySongItemProps {
    variant: VariantDTO,
    onClick?: ()=> void,
    index: number
}

export default function MySongItem(props: MySongItemProps) {
    const open = () => {
        props.onClick?.();
    }   

    const getHintText = () => {
        return props.variant.sections[0].text;
    }

    return (
        <div onClick={open}>
        <Box sx={{
            display:"flex",
            flexDirection:"row",
            gap: 2,
            alignItems:"center",
            padding: 2,
            paddingLeft: 4,
            paddingRight: 5,
            backgroundColor: "#e0e0e0",
            borderRadius: 1,
            cursor: "pointer",
            "&:hover":{
                backgroundColor: "#d0d0d0",
            },
        }}>
            <Typography variant='subtitle2'>{props.index}</Typography>
            <Gap value={1}/>
            <Box flex={1} sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}>
                <Typography variant='subtitle2' flex={1}>{props.variant.preferredTitle}</Typography>
                <Typography variant='caption' noWrap gutterBottom>
                    {getHintText()}
                </Typography>
            </Box>
            <Box>
                <Typography variant='caption' >{props.variant.verified ? "Veřejné" : "Soukromé"}</Typography>
            </Box>
            <Button onClick={open}>Otevřít</Button>
        </Box>
        </div>
    )
}

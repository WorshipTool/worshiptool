import { Box, Tooltip, Typography, styled } from '@mui/material'
import React from 'react'
import useGroup from '../../../hooks/useGroup'

const Container = styled(Box)(({theme})=>({
    display:"inline-block",
    flexDirection:"column",
    alignItems:"center",
    textAlign: "center",
    userSelect:"none"
}))

export default function Header() {
    const {logoUrl, longerName, fullName} = useGroup();
    
    const logoSize = 100;
    return (
        <Tooltip title={fullName} open={true}>
            <Container >
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={2}>
                    <Box width={logoSize} height={logoSize} display={"flex"} alignItems={"end"} justifyContent={"center"}>
                        <img src={logoUrl} style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            filter: "drop-shadow(0px 4px 0px #fff)",
                            pointerEvents:"none"
                        }}/>

                    </Box>
                    <Typography color={"white"} variant='h6'>{longerName}</Typography>
                </Box>
            </Container>
        </Tooltip>
    )
}

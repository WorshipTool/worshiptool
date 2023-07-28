import React from 'react'
import useSong from '../../hooks/song/useSong';
import useStack from '../../hooks/playlist/useStack';
import { Box, IconButton, Skeleton, Typography, styled } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';


const PanelItemContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[50],
    boxShadow: `0px 0px 5px ${theme.palette.grey[400]}`,
    borderRadius: 8,
    display:"flex",
    flexDirection:"row",
    "&:hover":{
        backgroundColor: theme.palette.grey[200],
        boxShadow: `0px 0px 9px ${theme.palette.grey[400]}`,
    },
    cursor:"pointer",
    justifyContent:"center",
    alignItems:"center",
    paddingRight:7
}))

const StyledPanelButton = styled(Typography)(({theme})=>({
    display:"flex",
    alignItems:"center",
    flex: 1,
    padding:9,
    paddingLeft:14,
}))


export default function PanelItem({guid, variants, onClick}:{guid:string, variants: string[], onClick: ()=>void}) {
    const {getName, loading} = useSong(guid);
    

    const move = (dir: number) => {
        const currIndex = variants.indexOf(guid);
        if(currIndex<0)return;

    }


    return <PanelItemContainer>
        {!loading?<StyledPanelButton onClick={onClick}>{getName()}</StyledPanelButton>
        :<Skeleton variant='text' width={200} sx={{marginLeft:2}} key={"skelet"+guid}></Skeleton>}

        {/* <Box display={"flex"} flexDirection={"row"} height={35}>
            {variants.indexOf(guid)!=0&&<IconButton  onClick={()=>{move(-1)}} size='small'>
                <KeyboardArrowUp/>
            </IconButton>}
            {variants.indexOf(guid)+1!=variants.length?
            <IconButton onClick={()=>{move(1)}} size='small' >
                <KeyboardArrowDown/>
            </IconButton>
            :<Box width={35}></Box>}
        </Box> */}
    </PanelItemContainer>
}
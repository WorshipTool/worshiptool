import React from 'react'
import useSong from '../../../../hooks/song/useSong';
import useStack from '../../../../hooks/playlist/useStack';
import { Box, IconButton, Skeleton, Typography, styled } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { PlaylistItemDTO } from '../../../../interfaces/playlist/PlaylistDTO';
import useInnerPlaylist from '../../hooks/useInnerPlaylist';


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
    paddingRight:7,
    scrollMarginTop: theme.spacing(0.5),
}))

const StyledPanelButton = styled(Typography)(({theme})=>({
    display:"flex",
    alignItems:"center",
    flex: 1,
    padding:9,
    paddingLeft:0,
}))

interface PanelItemProps {
    item: PlaylistItemDTO,
    onClick: ()=>void
}

export default function PanelItem({item, onClick}:PanelItemProps) {
    const {loading, items, reorder} = useInnerPlaylist();


    const move = (offset: number) => {
        const itemToSwap = items[items.indexOf(item)+offset];

        reorder([
            {guid: item.guid, order: itemToSwap.order},
            {guid: itemToSwap.guid, order: item.order}
        ])

    }


    return <PanelItemContainer id={"panelItem_"+item.guid}>
        {!loading?<>
            <Typography sx={{
                padding:"9px",
                paddingLeft:"14px"
            }} fontWeight={900}>{item.order+1}.</Typography>
            <StyledPanelButton onClick={onClick}>{item.variant.preferredTitle}</StyledPanelButton>
        </>
        :<Skeleton variant='text' width={200} sx={{marginLeft:2}} key={"skelet"+item.guid}></Skeleton>}

        <Box display={"flex"} flexDirection={"row"} height={35}>
            {items.indexOf(item)!=0&&<IconButton  onClick={()=>{move(-1)}} size='small'>
                <KeyboardArrowUp/>
            </IconButton>}
            {items.indexOf(item)+1!=items.length?
            <IconButton onClick={()=>{move(1)}} size='small' >
                <KeyboardArrowDown/>
            </IconButton>
            :<Box width={35}></Box>}
        </Box>
    </PanelItemContainer>
}
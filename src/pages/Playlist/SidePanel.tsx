import { Box, Button, IconButton, Typography, styled } from '@mui/material'
import React from 'react'
import Gap from '../../components/Gap'
import { Masonry } from '@mui/lab'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import useSong from '../../hooks/song/useSong'
import useStack from '../../hooks/playlist/useStack'


const Container = styled(Box)(({theme})=>({
    width: 300,
    backgroundColor: theme.palette.grey[200],
    position:"fixed",
    bottom:0,
    top:50,
    right:0,
    overflowY:"scroll"
}))

const PanelItemContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],
    boxShadow: `0px 0px 6px ${theme.palette.grey[400]}`,
    borderRadius: 8,
    display:"flex",
    flexDirection:"row",
    "&:hover":{
        backgroundColor: theme.palette.grey[200],
        boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
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

const PanelItem = ({guid}:{guid:string}) => {
    const {getName} = useSong(guid);
    
    const {songGUIDs, setGUIDs} = useStack();

    const move = (dir: number) => {
        const currIndex = songGUIDs.indexOf(guid);
        if(currIndex<0)return;

        setGUIDs((arr)=>{
            let newArr = [...arr];
            newArr.splice(currIndex+dir, 0, newArr.splice(currIndex, 1)[0]);
            return newArr;
        })
    }

    const onClick = () => {
        const el = document.getElementById("playlistItem_"+guid);
        el?.scrollIntoView({
            behavior: "smooth", 
            block: "start"
        });
    }

    return <PanelItemContainer>
        <StyledPanelButton onClick={onClick}>{getName()}</StyledPanelButton>

        <Box display={"flex"} flexDirection={"row"} height={35}>
            {songGUIDs.indexOf(guid)!=0&&<IconButton  onClick={()=>{move(-1)}} size='small'>
                <KeyboardArrowUp/>
            </IconButton>}
            {songGUIDs.indexOf(guid)+1!=songGUIDs.length?
            <IconButton onClick={()=>{move(1)}} size='small' >
                <KeyboardArrowDown/>
            </IconButton>
            :<Box width={35}></Box>}
        </Box>
    </PanelItemContainer>
}

export default function SidePanel() {

    const {songGUIDs, setGUIDs} = useStack();  

    const onPrint = () => {
        window.print();
    }

    const removeAll = () => {
        setGUIDs([]);
    }

    return (
        <Container displayPrint={"none"}>
            <Box margin={2}>
                <Box display={"flex"} flexDirection={"row"}>
                    <Typography variant='h6' fontWeight={"bold"} flex={1}>Pořadí</Typography>
                    <Button size="small" color='error' onClick={removeAll}>Odebrat vše</Button>
                </Box>
                <Gap/>
                {songGUIDs.length==0&&<>
                    <Typography variant='subtitle2'>V playlistu nejsou žádné písně...</Typography>
                </>}
                <Masonry columns={1}>
                    {songGUIDs.map((guid)=>{
                        return <PanelItem guid={guid} key={"order_"+guid}/>
                    })}
                </Masonry>
                <Gap value={6}/>
            </Box>
            
            <Button variant="contained" sx={{
                position:"fixed",
                bottom: 30,
                right: 30,
                displayPrint:"none"
            }} onClick={onPrint}>Vytisknout</Button>

        </Container>
    )
}

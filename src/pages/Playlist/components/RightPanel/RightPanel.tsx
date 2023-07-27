
import { Box, Typography, styled, useTheme } from '@mui/material'
import React, { useMemo, useState } from 'react'
import SearchBar from '../../../../components/SearchBar/SearchBar'
import SongSearch from '../../../../components/songLists/SongSearch/SongSearch'
import Gap from '../../../../components/Gap';
import SongListCards from '../../../../components/songLists/SongListCards/SongListCards'
import PlaylistSearchList from './PlaylistSearchList'
import Playlist from '../../../../interfaces/playlist/playlist'
import useRecommendedSongs from '../../../Home/components/RecommendedSongsList/hooks/useRecommendedSongs'
import usePlaylist from '../../../../hooks/playlist/usePlaylist'
import useInnerPlaylist from '../../hooks/useInnerPlaylist'
import useGroup from '../../../../hooks/group/useGroup';
import useGroupSelection from '../../../../hooks/group/useGroupSelection';

const Container = styled(Box)(({theme})=>({
    width: 300,
    position:"fixed",
    bottom:0,
    top:56,
    right:0,
    overflowY:"auto",
    boxShadow: `0px 0px 3px ${theme.palette.grey[400]}`,
    displayPrint: "none",
    userSelect: "none"
}))

interface RightPanelProps{
    playlist: Playlist | undefined
}
export default function RightPanel({playlist}: RightPanelProps) {
    const theme = useTheme();
    const [searchString, setSearchString] = useState("");
    const {data} = useRecommendedSongs();
    const {isOn} = useGroup();
    const {variants: selection} = useGroupSelection();
    const {variants} = useInnerPlaylist();

    const idea = useMemo(()=>{
        const arr = (isOn?selection.filter((s)=>!variants.map(v=>v.guid).includes(s.guid)):data);
        if(arr.length==0) return "";
        const index = Math.floor(Math.random()*(arr.length));
        return arr[index]?.preferredTitle;
    },[data, selection, isOn, variants]);
  return (
    <>
        <Container>
            <Box padding={1} paddingTop={0}>
                <Box position={"sticky"} top={0} paddingTop={1} sx={{
                    // backdropFilter: "blur(20px)"
                }}>
                    <SearchBar onChange={(v)=>setSearchString(v)}/>
                </Box>
                <Gap/>
                <SongSearch searchString={searchString} component={(v)=>{
                    const filtered = v.filter((v)=>{
                        return !variants.find((s)=>s.guid==v.guid);
                    })
                    return <PlaylistSearchList variants={filtered} playlist={playlist as Playlist} />
                }}/>
        
                {idea!=""? <>
                    <Typography fontWeight={500}>Nemáte nápad? </Typography>
                    <Typography>Zkuste třeba: <i>{idea}</i></Typography>
                </>:<>
                    <Typography>O-ou, došli nápady a písně...</Typography>
                </>}
                
            </Box>
        </Container>
        <Box width={300} displayPrint={"none"}></Box>
    </>
  )
}

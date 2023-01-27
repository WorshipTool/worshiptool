import { Box, Button, Divider, FormControlLabel, InputBase, Switch, Tooltip, Typography, styled, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { convertSongToNewSongDTO } from '../../backend/dtosSong';
import useFetch from '../../hooks/useFetch';
import { getUrl_POSTNEWSONG } from '../../backend/urls';
import { useNavigate } from 'react-router-dom';
import convertNewSongDataToSong from '../../api/conversition/convertNewSongDataToSong';
import { RequestResult, isSuccess } from '../../backend/dtosRequestResult';
import Toolbar from '../../components/Toolbar';
import DefaultStyle from '../Sheet/styles/DefaultStyle';
import Song, { Variant } from '../../models/song';
import convertSheetToSections from '../../api/conversition/convertSheetToSections';
import Gap from '../../components/Gap';
import ToolPanel from './ToolPanel';

const Container = styled(Box)(({theme})=>({
    width: "70%",
    margin: theme.spacing(5),
    display:"flex",
    flexDirection:"column"
}))

const StyledContainer = styled(Box)(({theme})=>({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.grey[100],
    boxShadow: `0px 0px 5px ${theme.palette.grey[400]}`,
    display:"flex"
}))

const TitleInput = styled(InputBase)(({theme})=>({
    fontWeight: theme.typography.fontWeightBold
}))
const SheetInput = styled(InputBase)(({})=>({
    height:200,
    justifyContent:"start",
    alignItems:"start"
}))

export default function Create() {
    const [posting, setPosting] = useState(false);

    const [preview, setPreview] = useState(false);

    const sheetInputRef :any = useRef(null);
    const titleInputRef :any = useRef(null);

    const [title, setTitle] = useState("");
    const [sheet, setSheet] = useState("");

    const navigate = useNavigate()

    const getSong = () : Song => {
        return {
            title: title,
            variants: [{
                guid: "",
                sheetData: sheet,
                sheetText: "",
                sections: convertSheetToSections(sheet),
                preferredTitle: "",
                createdBy: "",
                verified: false
            }],
            guid: "",
            alternativeTitles: [title],
            creators:[]
        };
    }

    const [song, setSong] = useState<Song>(getSong());


    useEffect(()=>{
        setSong(getSong());
    },[title, sheet])
    

    const {post, loading:fetching} = useFetch();

    useEffect(()=>{
        if(!fetching) setPosting(fetching);
    },[fetching])

    const onPostClick = () => {
        const song = getSong();
        setPosting(true);
        const dto = convertSongToNewSongDTO(
            convertNewSongDataToSong({
                title: song.title, 
                alternativeTitles: song.alternativeTitles, 
                sheet: song.variants[0].sheetData}));

        post({url: getUrl_POSTNEWSONG(), body: dto}, (d:RequestResult<any>)=> {
            if(isSuccess(d)){
                if(d.data.guid){
                    navigate(`/song/`+d.data.guid, { replace: false })
                }
            }            
        });
    }

    const newSection = (name:string) => {
        const target = sheetInputRef.current;
        let textToInsert = `{${name}}`
        let cursorPosition = target.selectionStart
        let textBeforeCursorPosition = target.value.substring(0, cursorPosition)
        let textAfterCursorPosition = target.value.substring(cursorPosition, target.value.length)
        setSheet(textBeforeCursorPosition + textToInsert + textAfterCursorPosition);
        target.focus();
    }

    const newChord = () => {
        const target = sheetInputRef.current;
        let textToInsert = "[C]"
        let cursorPosition = target.selectionStart
        let textBeforeCursorPosition = target.value.substring(0, cursorPosition)
        let textAfterCursorPosition = target.value.substring(cursorPosition, target.value.length)
        setSheet(textBeforeCursorPosition + textToInsert + textAfterCursorPosition);
        target.focus();
    }

    const keysHandler = useCallback(
        (event:any) => {
            if (event.altKey === true) {
                if(event.key==='c'){
                    newChord();
                    
                }

                if(event.key==='v'){
                    newSection("V");
                }
                if(event.key==='r'){
                    newSection("R");
                }
                if(event.key==='b'){
                    newSection("B");
                }
              }
        },[song]
    )

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
            <Toolbar transparent={false}/>
            <Box flex={1} display={"flex"} flexDirection={"row"}>
                <Box sx={{flex:1, display:"flex", flexDirection:"column", justifyContent:"start", alignItems:"center"}}>
                    
                    <Container>

                        <Box display={"flex"} justifyContent={"end"} padding={1}>   
                            <Typography display={"flex"} alignItems={"center"} variant='caption'>Náhled</Typography>                                 
                            <Switch size='small' checked={preview} onChange={(e)=>{setPreview((p)=>!p)}}/>
                        </Box>

                        {!preview?
                            <StyledContainer>
                                    
                                   <Box display={"flex"} flexDirection={"column"} flex={1}>
                                        <TitleInput placeholder='Zadejte název písně' inputRef={titleInputRef}
                                            value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
    
                                        <SheetInput placeholder='Zde je místo pro obsah písně...' inputRef={sheetInputRef} multiline
                                            value={sheet} onChange={(e)=>{setSheet(e.target.value)}} onKeyDown={keysHandler}/>
                                   </Box>

                                   <ToolPanel onNewSection={newSection} onNewChord={newChord}/>
            
                            </StyledContainer>
                            :
                            <StyledContainer flexDirection={"column"}>
                                {(song.title==""&&song.variants[0].sections.length==0)&&<Typography variant="caption">Tady uvidite ukazku...</Typography>}
                                    <DefaultStyle song={song} variant={song.variants[0]}/>
                            </StyledContainer>
                        }

                        <Gap/>
                        <Box display={"flex"} justifyContent={"start"}>
                            <Tooltip title={"Přidat"}>
                                <Button variant={"contained"} color={"primary"} disabled={posting||(song.title==""||song.variants[0].sheetData=="")} onClick={onPostClick}> 
                                    Ověřit a přidat
                                    {posting&& <CircularProgress color={"inherit"} size={16} sx={{marginLeft:1}}/> }
                                </Button>
                            </Tooltip>                            
                        </Box>
                    </Container>
        
                    
                    
        
                </Box>
            </Box>
        </Box>
    )
}

import { Box, Button, Divider, FormControlLabel, InputBase, Switch, Tooltip, Typography, styled, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import useFetch from '../../hooks/useFetch';
import { getUrl_ADDSONGDATA } from '../../backend/urls';
import { useNavigate, useParams } from 'react-router-dom';
import { RequestResult, isRequestSuccess } from '../../backend/dtos/RequestResult';
import Toolbar from '../../components/Toolbar';
import DefaultStyle from '../Sheet/styles/DefaultStyle';
import {convertSheetToSections} from "@pepavlin/sheet-api";
import Gap from '../../components/Gap';
import ToolPanel from './ToolPanel';
import { NewSongDataDTO, NewSongDataResult, convertSongToNewSongDTO } from '../../backend/dtos/dtosNewSongData';
import Song from '../../models/song/song';
import useSong from '../../hooks/song/useSong';

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

    const {guid} = useParams();

    const {setGUID, getName} = useSong(guid||null);

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
                preferredTitle: title,
                titles:[],
                createdBy: "",
                createdByLoader: false,
                verified: false,
                sources:[],
                creators:[]
            }],
            guid: "",
            creators:[],
            media:[],
            tags: []
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
        setPosting(true);
        const dto : Partial<NewSongDataDTO> = {
            title: title,            
            sheetData: sheet,
            media:[],
            songGuid: guid
        };

        post({url: getUrl_ADDSONGDATA(), body: dto}, (d:RequestResult<NewSongDataResult>)=> {
            console.log(d);
            if(isRequestSuccess(d)){
                if(d.data){
                    navigate(`/song/`+d.data.songGuid, { replace: false })
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

                        <Box display={"flex"}padding={1}>   
                            <Box flex={1} display={"flex"} alignItems={"center"} >
                                {guid&&<Typography>Parent song:</Typography>}
                                <Gap horizontal/>
                                {guid&&<Typography fontWeight={"bold"}>{getName()}</Typography>}
                            </Box>
                            <Box display={"flex"} justifyContent={"end"} padding={1}>
                                <Typography display={"flex"} alignItems={"center"} variant='caption'>Náhled</Typography>                                 
                                <Switch size='small' checked={preview} onChange={(e)=>{setPreview((p)=>!p)}}/>
                            </Box>
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

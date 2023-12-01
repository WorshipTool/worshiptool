import { Box, Button, Divider, FormControlLabel, InputBase, Switch, Tooltip, Typography, styled, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import useFetch from '../../../hooks/useFetch';
import { getUrl_ADDSONGDATA } from '../../../api/urls';
import { useNavigate, useParams } from 'react-router-dom';
import { RequestResult, isRequestSuccess } from '../../../api/dtos/RequestResult';
import Toolbar from '../../../components/Toolbars/Toolbar';
import DefaultStyle from '../../../components/SheetDisplay/styles/DefaultStyle';
import {Sheet} from "@pepavlin/sheet-api";
import Gap from '../../../components/Gap';
import ToolPanel from './ToolPanel';
import { NewSongDataDTO, NewSongDataResult, convertSongToNewSongDTO } from '../../../api/dtos/dtosNewSongData';
import Song from '../../../interfaces/song/song';
import useSong from '../../../hooks/song/useSong';
import ContainerGrid from '../../../components/ContainerGrid';
import AppContainer from '../../../components/AppContainer/AppContainer';
import ImportButton from './components/ImportButton';

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
    minHeight:200,
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
    const [sheetData, setSheetData] = useState("");

    const navigate = useNavigate()

    const [sheet, setSheet] = useState<Sheet>(new Sheet(sheetData));


    useEffect(()=>{
        setSheet(new Sheet(sheetData));
    },[sheetData])
    

    const {post, loading:fetching} = useFetch();

    useEffect(()=>{
        if(!fetching) setPosting(fetching);
    },[fetching])

    const onPostClick = () => {
        setPosting(true);
        const dto : Partial<NewSongDataDTO> = {
            title: title,            
            sheetData: sheetData,
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
        setSheetData(textBeforeCursorPosition + textToInsert + textAfterCursorPosition);
        target.focus();
    }

    const newChord = () => {
        const target = sheetInputRef.current;
        let textToInsert = "[C]"
        let cursorPosition = target.selectionStart
        let textBeforeCursorPosition = target.value.substring(0, cursorPosition)
        let textAfterCursorPosition = target.value.substring(cursorPosition, target.value.length)
        setSheetData(textBeforeCursorPosition + textToInsert + textAfterCursorPosition);
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
        },[]
    )

    const onImport = (title:string, data:string) => {
        setTitle(title);
        setSheetData(data);
    }

    return (
        <AppContainer>
            
            <Box flex={1} display={"flex"} flexDirection={"row"}>
                <Box sx={{flex:1, display:"flex", flexDirection:"column", justifyContent:"start", alignItems:"center"}}>
                    
                    <ContainerGrid  direction='column'>

                        <Box display={"flex"} padding={1} paddingLeft={0}>   
                            <Box flex={1} display={"flex"} alignItems={"center"} >
                                
                                {/* <ImportButton onLoad={onImport}/> */}
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
                                            value={sheetData} onChange={(e)=>{setSheetData(e.target.value)}} onKeyDown={keysHandler}/>
                                   </Box>

                                   <ToolPanel onNewSection={newSection} onNewChord={newChord}/>
            
                            </StyledContainer>
                            :
                            <StyledContainer flexDirection={"column"}>
                                {(title==""&&sheet.getSections().length==0)&&<Typography variant="caption" sx={{color:"grey"}}>Tady uvidite ukazku...</Typography>}
                                    <DefaultStyle title={title} sheet={sheet}/>
                            </StyledContainer>
                        }

                        <Gap/>
                        <Box display={"flex"} justifyContent={"start"}>
                            <Box flex={1}>
                                <Tooltip title={"Přidat"}>
                                    <Button variant={"contained"} color={"primary"} disabled={posting||(title==""||sheetData=="")} onClick={onPostClick}> 
                                        Vytvořit {"(neveřejně)"}
                                        {posting&& <CircularProgress color={"inherit"} size={16} sx={{marginLeft:1}}/> }
                                    </Button>
                                </Tooltip>
                            </Box>
                                                  
                        </Box>
                    </ContainerGrid>
        
                    
                    
        
                </Box>
            </Box>
        </AppContainer>
    )
}

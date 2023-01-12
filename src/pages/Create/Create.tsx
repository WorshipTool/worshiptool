import { Box, Button, InputBase, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { convertSongToNewSongDTO } from '../../backend/dtosSong';
import useFetch from '../../hooks/useFetch';
import { getUrl_POSTNEWSONG } from '../../backend/urls';
import { useNavigate } from 'react-router-dom';
import convertNewSongDataToSong from '../../api/conversition/convertNewSongDataToSong';
import { RequestResult, isSuccess } from '../../backend/dtosRequestResult';

export default function Create() {
    const theme = useTheme();

    const [titleValue, setTitleValue] = useState("");
    const [altTitleValue, setAltTitleValue] = useState("");
    const [titles, setTitles] = useState<string[]>([]);
    const [sheetValue, setSheetValue] = useState("");

    const [altTitleTyping, setAltTitleTyping] = useState(false);

    const [posting, setPosting] = useState(false);

    const sheetInputRef = useRef(null);
    const titleInputRef = useRef(null);

    const navigate = useNavigate()
    

    const {post, loading:fetching} = useFetch();

    useEffect(()=>{
        if(!fetching) setPosting(fetching);
    },[fetching])



    const onTitleValueChange = (event: any) => {
        setTitleValue(event.target.value);
    }
    const onAltTitleValueChange = (event: any) => {
        setAltTitleValue(event.target.value);
    }
    const onSheetValueChange = (event: any) => {
        setSheetValue(event.target.value);
    }

    const onAddAltTitleClick = () => {
        setAltTitleTyping(true);
    }

    const onTitleInputKeyDown = (event: any) => {
        if(event.key==="Enter"){
            setMainTitle();
            
        }
        if(event.key==="Escape"){
            
        }
    }
    const onTitleInputKeyUp = (event:any)=>{
        const sheetInput : any = sheetInputRef.current;
        if(event.key==="Enter"){
            sheetInput.focus();

        }
    }

    const setMainTitle = () => {
        const newTitles : string[] = [...titles];

        if(newTitles.length==0) newTitles.push("");

        newTitles[0] = titleValue;

        setTitles(newTitles);

    }
    const onAltTitleInputKeyDown = (event: any) => {
        if(event.key==="Enter"){
            addAltTitle();
        }
        if(event.key==="Escape"){
            blurAltTitleInput();
        }
    }
    const onAltTitleInputBlur = () => {
        if(altTitleValue==""){
            blurAltTitleInput();
            return;
        }
        addAltTitle();
    }
    const blurAltTitleInput = () => {
        setAltTitleTyping(false);
        setAltTitleValue("");
    }
    const addAltTitle = () => {
        setTitles([...titles, altTitleValue]);
        setAltTitleTyping(false);
        setAltTitleValue("");
    }

    const onPostClick = () => {
        setPosting(true);
        const dto = convertSongToNewSongDTO(
            convertNewSongDataToSong({
                title: titleValue, 
                alternativeTitles: titles.length<2?[]:titles.slice(1, titles.length-1), 
                sheet: sheetValue}));

        post({url: getUrl_POSTNEWSONG(), body: dto}, (d:RequestResult<any>)=> {
            console.log(d);
            if(isSuccess(d)){
                if(d.data.songGUID){
                    navigate(`/song/`+d.data.songGUID, { replace: false })
                }
            }            
        });
    }


    const isAltTitlesEnabled = () => {
        return titles.length>0&&titles[0]!="";
    }

    const RemoveAltIcon = styled(CloseIcon)(()=>({
        fontSize:"inherit",
        marginTop:0.1,
        marginLeft:0.2,
        color:theme.palette.grey[500],
        '&:hover':{
            color:"black"
        }
        }))

    const AltTitle = ({index,title,onRemove}:{index:number,title:string, onRemove:()=>void}) => {
        return (
            <Box sx={{padding: 1, paddingTop: 0.3, paddingBottom: 0.3, bgcolor: theme.palette.grey[300], borderRadius: 1,
                "&:hover":{
                    bgcolor:theme.palette.grey[400]
                }}}>
                <Typography variant={"caption"} sx={{fontWeight: "300", fontSize: 13, alignItems:"center", display:"flex"}}>
                    {title}
                    {!posting&&<RemoveAltIcon onClick={onRemove}/>}
                </Typography>
            </Box>
        
        )
    }

    const styledContainerSX = {
        margin:3,
        marginBottom:0,
        padding:3,
        backgroundColor: theme.palette.grey[100],
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: theme.palette.grey[400],
        borderRadius: 1,
        flex:1,
        display:"flex",
        flexDirection: "column"
    }
    const titleInputSX = {
        width:"100%",
        fontSize: 25,
        fontWeight: "300"
    }

    const postButtonContainerSX = {
        margin: 3
    }
    return (
        <Box sx={{flex:1, display:"flex", flexDirection:"column", height: "100vh"}}>
            <Box sx={styledContainerSX}> 
                <InputBase inputRef={titleInputRef} placeholder='Zadej název písně' value={titleValue} sx={titleInputSX} size={"medium"}
                    onChange={onTitleValueChange} onKeyDown={onTitleInputKeyDown} onKeyUp={onTitleInputKeyUp} onBlur={setMainTitle} autoFocus/>
    
                
                {isAltTitlesEnabled()&&(
    
                    <Box sx={{display:"flex", gap: 1}}>
    
                        {titles.filter((t, index)=>index!=0).map((title, index)=>{    
                            const onRemove = () => {
                                setTitles([
                                    ...titles.slice(0, index),
                                    ...titles.slice(index + 1)
                                  ]);
                            }
    
                            return (
                                <AltTitle index={index} title={title} onRemove={onRemove} key={"title"+index}/>
                            )
                        })}
    
                        {altTitleTyping&&
                            <InputBase placeholder='Nový podnázev' sx={{fontWeight: "300"}} size={"small"} 
                                onKeyDown={onAltTitleInputKeyDown} value={altTitleValue} onChange={onAltTitleValueChange} 
                                onBlur={onAltTitleInputBlur} autoFocus/>
                        }
        
                        {!altTitleTyping&&!posting&&
                            <Button sx={{color:"black"}} size={"small"} onClick={onAddAltTitleClick}>
                                <Typography variant="caption" sx={{alignItems:"center", display:"flex"}}>
                                    <AddIcon fontSize='inherit' sx={{marginRight:0.5}}/>
                                    PŘIDEJ PODNÁZEV
                                </Typography>
                            </Button>
                        }   
                    </Box>
    
                )}
    
                <Box sx={{flex:1, display:"flex", marginTop:2}}>
                    <InputBase inputRef={sheetInputRef} placeholder='Zde je místo na obsah písně' multiline 
                        sx={{flex:1, alignItems:"start"}} value={sheetValue} onChange={onSheetValueChange}/>
                </Box>
    
                
            </Box>

            <Box sx={postButtonContainerSX}>
                <Button variant={"contained"} color={"primary"} disabled={posting} onClick={onPostClick}> 
                    Ověřit a přidat
                    {posting&& <CircularProgress color={"inherit"} size={16} sx={{marginLeft:1}}/> }
                </Button>
            </Box>
            

        </Box>
    )
}

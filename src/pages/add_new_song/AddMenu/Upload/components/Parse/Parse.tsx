import React, { useEffect, useState } from 'react'
import AppContainer from '../../../../../../components/AppContainer/AppContainer';
import { useLocation } from 'react-router-dom';
import { EasySheet } from '../../Upload';
import { isRequestSuccess } from '../../../../../../api/dtos/RequestResult';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import Gap from '../../../../../../components/Gap';
import SheetListPreview from '../SheetListPreview';
import UploadedSongList from '../UploadedSongList/UploadedSongList';
import { NewSongDataDTO } from '../../../../../../api/dtos/dtosNewSongData';
import useImport from '../../../../Write/hooks/useImport';
import useFetch from '../../../../../../hooks/useFetch';
import { getUrl_ADDSONGDATA } from '../../../../../../api/urls';
import UploadPanel from '../UploadPanel/UploadPanel';

const parsingMessages = [
    "Nahrávám soubor...",
    "Zpracovávám soubor...",
    "Snažím se přečíst soubor...",
    "Hledám píseň ve vašem souboru...",
]

const uploadingMessages = [
    "Nahrávám píseň...",
    "Přidávám píseň do databáze...",
    "Ukládám píseň...",
    "Ukládám píseň do databáze..."
]

export default function Parse() {
    const {state} : {state:{files:File[]}} = useLocation()

    const [parsed, setParsed] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState("");

    const [sheets, setSheets] = React.useState<EasySheet[]>([]);
    const [uploading, setUploading] = React.useState(false);
    const [uploadingMessage, setUploadingMessage] = React.useState("")
    const [uploaded, setUploaded] = useState(false);
    const [uploadedSongs, setUploadedSongs] = useState<{
        title: string,
        guid: string
    }[]>([]);
    

    const {post, loading:fetching} = useFetch();
    const upload = useImport();

    const startParsing = async (files: File[]) => {
        setLoading(true);
        setUploaded(false);

        const sheets : EasySheet[] = [];
        for(let i = 0; i < files.length; i++){
            const file = files[i];
            const message = parsingMessages[Math.floor(Math.random() * parsingMessages.length)]+"\t" + (i+1) + "/" + files.length;
            setLoadingMessage(message);
            const data = await upload(file)

            if(isRequestSuccess(data)){
                const sheetsData = data.data.sheets;
                sheetsData.forEach((sheetData)=>{
                    sheets.push({
                        title: sheetData.title,
                        data: sheetData.data,
                        randomHash: Math.random().toString(36).substring(7),
                        originalFile: file
                    });
                })
            }
        }
        setLoadingMessage("Rozluštěno")
        setSheets(sheets);
        setTimeout(()=>{
            setLoading(false);
            setParsed(true);
        }, 500);
    }

    const uploadSheets = async () => {
        setUploading(true);
        setUploaded(false);
        
        const guids : string[] = [];
        for(let i=0; i<sheets.length; i++){

            const message = uploadingMessages[Math.floor(Math.random() * uploadingMessages.length)]
                +"\t" + (i+1) + "/" + sheets.length;

            setUploadingMessage(message);

            const sheet = sheets[i];
            const dto : Partial<NewSongDataDTO> = {
                title: sheet.title,            
                sheetData: sheet.data,
                media:[],
                songGuid: undefined
            };
    
            const result = await post({url: getUrl_ADDSONGDATA(), body: dto});
            if(isRequestSuccess(result)){
                if(result.data){
                    guids.push(result.data.songGuid);
                }
            }

            
        
        }
        setUploadingMessage("Hotovo")
        setTimeout(()=>{

            // navigate("/song/"+guids[0]);
            setUploadedSongs(guids.map((guid, i)=>{
                return {
                    title: sheets[i].title,
                    guid: guid
                }
            }));
            setUploading(false);
            setUploaded(true);

        }, 2000);

    }

    useEffect(()=>{
        if(state&&state.files){
            startParsing(state.files);
        }
    },[])

    return (
        <AppContainer>
            <Box sx={{
            width: "100%",
            height: 500,
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            paddingTop: 5,
        
        }}>
            {!loading ? <Box sx={{
            }}>
                {!uploaded ? <>
                    {!uploading ? <>
                        
                        <Box sx={{
                            display:"flex",
                            flexDirection:"row",
                            justifyContent:"space-between",
                            alignItems:"center",
                        }}>
                            <Box>
                                
                                <Typography variant='subtitle2'>Zkontrolujte, zda bylo vše správně načteno...</Typography>
                            </Box>
                            <Box>
                                <Button variant='contained' size='large' endIcon={<CloudUpload/>} onClick={uploadSheets}>
                                     <Typography variant='button'>Ano, vše je pořádku</Typography>
                                </Button>
                    
                            </Box>
                            
                        </Box>
                        <Gap/>
                        <SheetListPreview sheets={sheets} onChange={(sheets)=>{
                            setSheets(sheets);
                            if(sheets.length===0){
                                setParsed(false);
                            }
                        }}/>
                    </> : <>
                        <Box sx={{
                            height: 200,
                            display:"flex",
                            flexDirection:"column",
                            justifyContent:"end",
                        }}>
                            <CircularProgress/>
                            <Gap/>
                            <Typography variant='subtitle2'>{uploadingMessage}</Typography>
                        </Box>
                    </>}
                </> : <>
                    <UploadedSongList songs={uploadedSongs}/>
                    <Gap/>
                    <Box sx={{
                        display:"flex",
                        flexDirection:"row",
                        justifyContent:"end",
                    }}>
                        <Button variant='contained' onClick={()=>{
                            setParsed(false);
                            setUploaded(false);
                        }}>Nahrát další</Button>
                    </Box>
                    <Gap value={2}/>
                    
                </>}
            </Box> : <Box sx={{
                width: "100%",
                height: "100%",
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
            }}>
                <Paper sx={{
                    width: 360,
                    height: 330,
                    borderRadius: 5,
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                    userSelect:"none",
                    bgcolor: "grey.100",
                    border: "0px solid"
                }}>

                    <Box sx={{
                        display: "block"
                    }}>
                        <CircularProgress />
                    </Box>

                    {loading && <Box>
                        <Gap value={4}/>
                        <Typography>{loadingMessage || "Nahrávání"}</Typography>
                    </Box>}
                    
                </Paper>
            </Box>
            }

        </Box>
            
        </AppContainer>
    )
}

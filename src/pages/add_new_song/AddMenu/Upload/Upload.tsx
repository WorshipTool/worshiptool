import React from 'react'
import AppContainer from '../../../../components/AppContainer/AppContainer'
import UploadPanel from './components/UploadPanel/UploadPanel'
import { Box } from '@mui/material'
import SheetListPreview from './components/SheetListPreview';
import useImport from '../../Write/hooks/useImport';
import { isRequestSuccess } from '../../../../api/dtos/RequestResult';

interface EasySheet {
    title: string,
    data: string,
}

export default function Upload() {
    const [uploaded, setUploaded] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState("");

    const [sheets, setSheets] = React.useState<EasySheet[]>([]);

    const upload = useImport();

    const messages = [
        "Nahrávám soubor...",
        "Zpracovávám soubor...",
        "Snažím se přečíst soubor...",
        "Hledám píseň ve vašem souboru...",
    ]
    const uploadFiles = async (files: File[]) => {
        console.log(files);
        setLoading(true);

        const sheets : EasySheet[] = [];
        for(let i = 0; i < files.length; i++){
            const file = files[i];
            const message = messages[Math.floor(Math.random() * messages.length)]+"\t" + (i+1) + "/" + files.length;
            setLoadingMessage(message);
            const data = await upload(file)
            console.log(data);

            if(isRequestSuccess(data)){
                const sheetsData = data.data.sheets;
                sheetsData.forEach((sheetData)=>{
                    sheets.push(sheetData);
                })
            }
        }
        setLoadingMessage("Rozluštěno")
        setSheets(sheets);
        setTimeout(()=>{
            setLoading(false);
            setUploaded(true);
        }, 500);
    }

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
            {!uploaded ? <Box sx={{
                width: "100%",
                height: "100%",
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
            }}>
                <UploadPanel onUpload={uploadFiles} loading={loading} loadingMessage={loadingMessage}/> 
            </Box> : <Box sx={{
                bgcolor: "background.paper",
                padding: 5,
            }}>
                <SheetListPreview sheets={sheets}/>
            </Box>}
        </Box>
    </AppContainer>
  )
}

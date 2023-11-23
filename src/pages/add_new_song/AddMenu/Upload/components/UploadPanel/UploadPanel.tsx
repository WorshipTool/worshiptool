import { CloudUpload } from '@mui/icons-material'
import { Box, Button, CircularProgress, Paper, Typography, SxProps } from '@mui/material';
import React, { useRef } from 'react'
import Gap from '../../../../../../components/Gap'
import useImport from '../../../../Write/hooks/useImport';
import DragAndDrop from './components/DragAndDrop';
import UploadFileInput from '../UploadFileInput';

interface UploadPanelProps {
    onUpload?: (files: File[]) => void
}

export default function UploadPanel(props: UploadPanelProps) {
    const inputRef = useRef(null);

    const [draggingOver, setDraggingOver] = React.useState(false);


    const uploadFiles = (files: File[]) => {
        if(props.onUpload) props.onUpload(files);
    }

    const openFilePicker = () => {
        console.log(inputRef)

        //@ts-ignore
        inputRef.current.click();
    }

    return (
        <DragAndDrop onDragOver={()=>{
            setDraggingOver(true);
        }} onDragLeave={()=>{
            setDraggingOver(false);
        }} onDrop={(files)=>{
            setDraggingOver(false);
            uploadFiles(files);
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
                bgcolor: draggingOver? "grey.500" : "grey.100",
                border: draggingOver? "0px solid" : "2px dashed",
            }}>

                <Box sx={{
                    display: "flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                }}>
                    {!draggingOver ? <Box sx={{
                            fontSize: 60,
                            display:"flex",
                            flexDirection:"column",
                            justifyContent:"center",
                            alignItems:"center",
                            color:"grey.500",
                        }}>
                            <CloudUpload fontSize={"inherit"}/>
                            <Box sx={{
                                display:"flex",
                                flexDirection:"column",
                                justifyContent:"center",
                                alignItems:"center",
                            }}>
                                <Typography>Sem přetáhněte soubory k nahrání</Typography>
                            </Box>  
                        </Box> : <Box sx={{
                            fontSize: 60,
                            display:"flex",
                            flexDirection:"column",
                            justifyContent:"center",
                            alignItems:"center",
                            color:"white",
                        }}>
                            <CloudUpload fontSize={"inherit"}/>
                            <Box sx={{
                                display:"flex",
                                flexDirection:"column",
                                justifyContent:"center",
                                alignItems:"center",
                            }}>
                                <Typography>Pusťte soubory zde</Typography>
                            </Box>
                        </Box>
                    }
                    
                    <Gap value={4}/>
                    <Button variant='contained' onClick={openFilePicker} sx={{
                        display: draggingOver? "none" : "block"
                    }}>Vybrat soubory</Button>
                </Box>

                
            </Paper>
            <UploadFileInput inputRef={inputRef} onUpload={(files)=>uploadFiles(files)}/>
        </DragAndDrop>
    )
}

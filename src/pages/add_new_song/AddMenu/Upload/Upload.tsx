import React, { useState } from 'react'
import AppContainer from '../../../../components/AppContainer/AppContainer'
import UploadPanel from './components/UploadPanel/UploadPanel'
import { Box} from '@mui/material'
import { useNavigate } from 'react-router-dom';

export interface EasySheet {
    title: string,
    data: string,
    randomHash: string,
    originalFile: File
}

export default function Upload() {
    


    const navigate = useNavigate();

    const parseFiles = async (files: File[]) => {
        navigate("/add/upload/parse", {state: {files: files}})
        return;
        
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
            <Box sx={{
                width: "100%",
                height: "100%",
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
            }}>
                <UploadPanel onUpload={parseFiles}/> 
            </Box>
        </Box>
    </AppContainer>
  )
}

import React, { useState } from 'react'
import AppContainer from '../../../../components/AppContainer/AppContainer'
import UploadPanel from './components/UploadPanel/UploadPanel'
import { Box, Button, CircularProgress, Switch, Typography } from '@mui/material'
import SheetListPreview from './components/SheetListPreview';
import useImport from '../../Write/hooks/useImport';
import { RequestResult, isRequestSuccess } from '../../../../api/dtos/RequestResult';
import Gap from '../../../../components/Gap';
import { CloudUpload } from '@mui/icons-material';
import { NewSongDataDTO, NewSongDataResult } from '../../../../api/dtos/dtosNewSongData';
import useFetch from '../../../../hooks/useFetch';
import { getUrl_ADDSONGDATA } from '../../../../api/urls';
import { useNavigate } from 'react-router-dom';
import UploadedSongList from './components/UploadedSongList/UploadedSongList';

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

import { Edit, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import React from 'react'

interface EditButtonProps {
    onClick?: (editable: boolean) => void
    inEditMode?: boolean,
    loading?: boolean,
    sheetData: string
    title: string
}

export default function EditButton(props: EditButtonProps) {
    const {enqueueSnackbar} = useSnackbar();
  return (
    <>
        <LoadingButton
            variant='contained'
            color={props.inEditMode ? "info" : "secondary"}
            startIcon={props.inEditMode ? <Save/> : <Edit/>}
            loading={props.loading}
            loadingIndicator="Ukládání..."
            onClick={async ()=>{
                if(props.inEditMode){
                    if(props.sheetData === "" || props.title === ""){
                        enqueueSnackbar("Nelze uložit píseň s prázdným polem");
                        return;
                    }
                }
                props.onClick?.(!props.inEditMode);
            }}>
            {props.inEditMode ? "Uložit" : "Upravit"}
        </LoadingButton>
    </>
  )
}

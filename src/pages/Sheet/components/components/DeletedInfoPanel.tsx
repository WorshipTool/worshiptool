import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO'
import useAuth from '../../../../hooks/auth/useAuth'
import { LoadingButton } from '@mui/lab'
import Gap from '../../../../components/Gap'
import { Restore } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { SongsApi } from '../../../../api/generated'
import { useApiState } from '../../../../tech/ApiState'
import { handleApiCall } from '../../../../tech/handleApiCall';

interface DeletedInfoPanelProps {
    variant: VariantDTO,
    reloadSong: ()=>void
}

export default function DeletedInfoPanel({
    variant,
    reloadSong
}: DeletedInfoPanelProps) {

    const {isAdmin, apiConfiguration} = useAuth();
    const {enqueueSnackbar} = useSnackbar();

    const songsApi = new SongsApi(apiConfiguration);
    const {fetchApiState, apiState:{
        loading
    }} = useApiState();
    const restore = () => {
        fetchApiState(async ()=>{
            return handleApiCall(songsApi.songsControllerRestore(variant.guid));
        }, ()=>{
            enqueueSnackbar(`Píseň ${(variant.preferredTitle && " " || "")}byla obnovena.`);
            reloadSong?.();
        }) 
    }
  return (
    <Box sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    }}>
        <Typography color="error">Tato píseň byla smazána.</Typography>
        <Gap value={2} horizontal/>
        {isAdmin()&&<>
            <LoadingButton
                variant='contained'
                color='secondary'
                startIcon={<Restore/>}
                loadingIndicator="Obnovování..."
                loading={loading}
                onClick={restore}>
                Obnovit
            </LoadingButton>
        </>}
    </Box>
  )
}

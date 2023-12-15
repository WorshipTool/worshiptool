import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO'
import useAuth from '../../../../hooks/auth/useAuth'
import { LoadingButton } from '@mui/lab'
import Gap from '../../../../components/Gap'
import { Restore } from '@mui/icons-material'
import useFetch from '../../../../hooks/useFetch'
import { getUrl_RESTOREVARIANT } from '../../../../api/urls'
import { isRequestSuccess } from '../../../../api/dtos/RequestResult'
import { useSnackbar } from 'notistack'

interface DeletedInfoPanelProps {
    variant: VariantDTO,
    reloadSong: ()=>void
}

export default function DeletedInfoPanel({
    variant,
    reloadSong
}: DeletedInfoPanelProps) {

    const {isAdmin} = useAuth();
    const [loading, setLoading] = React.useState(false);
    const {post} = useFetch();
    const {enqueueSnackbar} = useSnackbar();

    const restore = () => {
        setLoading(true);
        post({url: getUrl_RESTOREVARIANT(variant.guid)},(result)=>{
            if(isRequestSuccess(result)){
                enqueueSnackbar(`Píseň ${(variant.preferredTitle && " " || "")}byla obnovena.`);
                reloadSong?.();
            }
            setLoading(false);

        });
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

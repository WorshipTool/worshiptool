import { Edit, Remove, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import React from 'react'
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO'
import useFetch from '../../../../hooks/useFetch'
import { getUrl_DELETEVARIANT } from '../../../../api/urls'
import { isRequestSuccess } from '../../../../api/dtos/RequestResult'
import { useNavigate } from 'react-router-dom'

interface DeleteButtonProps {
    variant: VariantDTO,
    reloadSong?: ()=>void
}

export default function DeleteButton({
    variant,
    reloadSong
}: DeleteButtonProps) {
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const {post} = useFetch();

    const onClick = async () => {
        if(variant.verified){
            enqueueSnackbar("Nelze smazat veřejnou píseň.")
            return;
        }
        setLoading(true);
        post({url: getUrl_DELETEVARIANT(variant.guid)},(result)=>{
            setLoading(false);
            console.log(result)
            if(isRequestSuccess(result)){
                enqueueSnackbar(`Píseň ${(variant.preferredTitle && " " || "")}byla smazána.`);
                reloadSong?.();

                // back in history
                navigate(-1);
            }

        });

    }

  return (
    <>
        <LoadingButton
            variant='contained'
            color={"error"}
            // startIcon={<Remove/>}
            loading={loading}
            loadingIndicator="Odstraňování..."
            onClick={async ()=>{
                onClick();
            }} disabled={variant.deleted}>
            {variant.deleted ? "Smazáno" : "Smazat"}
        </LoadingButton>
    </>
  )
}

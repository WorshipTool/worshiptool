import { Edit, Remove, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
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
    const [fetching, setFetching] = React.useState(false);
    const navigate = useNavigate();
    const {post} = useFetch();

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const onClick = async () => {
        if(variant.verified){
            enqueueSnackbar("Nelze smazat veřejnou píseň.")
            return;
        }
        
        setDialogOpen(true);
        setLoading(true);
    }

    const indeedDelete = async () => {
        return post({url: getUrl_DELETEVARIANT(variant.guid)},(result)=>{
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

    const yesClick = () => {
        setFetching(true);
        indeedDelete().then(()=>{
            setDialogOpen(false);
            setFetching(false);
        })
    }

    const noClick = () => {
        if(fetching) return;
        setDialogOpen(false);
        setLoading(false);
    }

  return (
    <>
        <LoadingButton
            variant='contained'
            color={"error"}
            // startIcon={<Remove/>}
            loading={loading}
            loadingIndicator="Mazání..."
            onClick={async ()=>{
                onClick();
            }} disabled={variant.deleted}>
            {variant.deleted ? "Smazáno" : "Smazat"}
        </LoadingButton>

        <Dialog
            open={dialogOpen}
            onClose={noClick}>
            <DialogTitle>
                Opravdu chcete smazat píseň?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {fetching 
                        ? "Probíhá odstraňování písně..."
                        : "Píseň se smaže natrvalo."}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    onClick={noClick}
                    disabled={fetching}>
                    Ne
                </Button>
                <LoadingButton
                    loading={fetching}
                    variant='contained'
                    color='error'
                    onClick={yesClick}>
                    Ano
                </LoadingButton>
            </DialogActions>
        </Dialog>
    </>
  )
}

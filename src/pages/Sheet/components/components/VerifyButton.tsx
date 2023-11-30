import React from 'react'
import useAuth from '../../../../hooks/auth/useAuth';
import { Button, CircularProgress } from '@mui/material';
import { verify } from 'crypto';
import useFetch from '../../../../hooks/useFetch';
import { getUrl_UNVERIFYVARIANT, getUrl_VERIFYVARIANT } from '../../../../api/urls';
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Public, PublicOff } from '@mui/icons-material';

export interface VerifyButtonProps {
    variant: VariantDTO,
    reloadSong: ()=>void
}

export default function VerifyButton(props: VerifyButtonProps) {

    const {post} = useFetch();
    const {enqueueSnackbar} = useSnackbar();

    const [loading, setLoading] = React.useState(false);

    const reload = () =>{
        props.reloadSong();
    }

    
    const unverify = () => {
        setLoading(true);
        post({url: getUrl_UNVERIFYVARIANT(props.variant.guid)},(result)=>{
            setLoading(false);
            reload();
            enqueueSnackbar(`Ověření písně ${(props.variant.preferredTitle && " " || "")}bylo zrušeno`);
        });
        
    }
    const verify = () => {
        setLoading(true);
        post({url: getUrl_VERIFYVARIANT(props.variant.guid)},(result)=>{
            setLoading(false);
            reload();
            enqueueSnackbar(`Píseň ${(props.variant.preferredTitle && " " || "")}byla ověřena.`);
        });
    }

    
  return (
    <div>
        <LoadingButton 
            onClick={()=>{
                if(props.variant.verified){
                    unverify();
                }else{
                    verify();
                }
            }} 
            loading={loading} 
            loadingPosition="start"
            startIcon={
                props.variant.verified ? <PublicOff/> : <Public/>
            }>
            {props.variant.verified ? "Zrušit zveřejnění" : "Zveřejnit"}
        </LoadingButton>
    </div>
  )
}

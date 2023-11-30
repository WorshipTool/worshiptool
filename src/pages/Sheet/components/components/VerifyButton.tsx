import React from 'react'
import useAuth from '../../../../hooks/auth/useAuth';
import { Button } from '@mui/material';
import { verify } from 'crypto';
import useFetch from '../../../../hooks/useFetch';
import { getUrl_UNVERIFYVARIANT, getUrl_VERIFYVARIANT } from '../../../../api/urls';
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import { useSnackbar } from 'notistack';

export interface VerifyButtonProps {
    variant: VariantDTO,
    reloadSong: ()=>void
}

export default function VerifyButton(props: VerifyButtonProps) {

    const {post} = useFetch();
    const {enqueueSnackbar} = useSnackbar();

    const reload = () =>{
        props.reloadSong();
    }

    
    const unverify = () => {
        post({url: getUrl_UNVERIFYVARIANT(props.variant.guid)},(result)=>{
            reload();
            enqueueSnackbar(`Ověření písně ${(props.variant.preferredTitle && " " || "")}bylo zrušeno`);
        });
        
    }
    const verify = () => {
        post({url: getUrl_VERIFYVARIANT(props.variant.guid)},(result)=>{
            reload();
            enqueueSnackbar(`Píseň ${(props.variant.preferredTitle && " " || "")}byla ověřena.`);
        });
    }

    
  return (
    <div>
        {props.variant.verified ? "Ano": "Ne"}
        {props.variant.verified ? <>
            <Button onClick={()=>unverify()}>Zrušit zveřejnění</Button>
        </>:<>
            <Button onClick={()=>verify()}>Zveřejnit</Button>
        </>}
    </div>
  )
}

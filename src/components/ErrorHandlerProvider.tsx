import React, { useEffect } from 'react'
import { networkErrorEvent, unauthorizedEvent } from '../tech/handleApiCall'
import { useSnackbar } from 'notistack'
import { Button } from '@mui/material';

interface ErrorHandlerProviderProps {
    children: React.ReactNode
}

export default function ErrorHandlerProvider(props: ErrorHandlerProviderProps) {
    const {enqueueSnackbar} = useSnackbar();

    useEffect(()=>{
        const ne = () =>{
            enqueueSnackbar("Nelze se spojit se serverem.", {
                variant: "error", 
                persist:true,
                preventDuplicate:true,
                action: () => {
                    return <Button 
                        onClick={()=>window.location.reload()} 
                        color="inherit"
                        variant='outlined'
                        size='small'>
                        Zkusit to znovu
                        </Button>
                }
            })
        }

        const ue = () =>{
            enqueueSnackbar("Problém s autorizací.", {
                variant: "error", 
                persist:true
            })
        }
        window.addEventListener(networkErrorEvent.type, ne)
        window.addEventListener(unauthorizedEvent.type, ue)

        return ()=>{
            window.removeEventListener(networkErrorEvent.type, ne)
            window.removeEventListener(unauthorizedEvent.type, ue)
        }
    },[])
  return (
    <>
      {props.children}
    </>
  )
}

import { Box, Button, ButtonGroup } from '@mui/material'
import React from 'react'
import { isRequestSuccess } from '../../../../api/dtos/RequestResult';
import { ApiGroupDto } from '../../../../api/dtos/group/ApiGroupDto';
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import useFetch from '../../../../hooks/useFetch';
import Gap from '../../../../components/Gap';
import { LoadingButton } from '@mui/lab';
import { Workspaces } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

interface Buttons13kaProps {
    variant: VariantDTO
}

export default function Buttons13ka(props: Buttons13kaProps) {

    const {fetch, post: postData} = useFetch();
    const [loading, setLoading] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const addTo13ka = async () => {
        setLoading(true);
        const result = await fetch<ApiGroupDto>({url: "/group", params:{name:"13ka"}})
        if(isRequestSuccess(result)){
            const res2 = await postData({url: "/songs/playlist/add", body: {
                playlist: result.data.selection,
                variant: props.variant.guid
            }})

            setLoading(false);
            if(isRequestSuccess(res2)){
                enqueueSnackbar("Píseň byla přidána do 13ky");
                return;
            }else{
                enqueueSnackbar("\""+res2.message+"\"");
                return;
            }
        }
        setLoading(false);

    }
    const removeFrom13ka = async () => {
        setLoading(true);
        const result = await fetch<ApiGroupDto>({url: "/group", params:{name:"13ka"}})
        if(isRequestSuccess(result)){
            const res2 = await postData({url: "/songs/playlist/remove", body: {
                playlist: result.data.selection,
                variant: props.variant.guid
            }})

            setLoading(false);
            if(isRequestSuccess(res2)){
                enqueueSnackbar("Píseň byla odebrána ze 13ky");
                return;
            }else{
                enqueueSnackbar("\""+res2.message+"\"");
                return;
            }
        }
        setLoading(false);

    }

  
  return (
    <Box sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    }}>
        <ButtonGroup size="medium">
            <LoadingButton 
                variant="contained" 
                color='secondary' 
                onClick={removeFrom13ka}
                loading={loading}
                startIcon={<Workspaces/>}
                loadingPosition='start'>
                    Odebrat ze 13ky
            </LoadingButton>
            
            
            <LoadingButton 
                variant="contained" 
                color='secondary' 
                onClick={addTo13ka}
                loading={loading}
                startIcon={<Workspaces/>}
                loadingPosition='start'>
                    Do 13ky
            </LoadingButton>
        </ButtonGroup>
    </Box>
  )
}

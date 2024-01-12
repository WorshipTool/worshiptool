import { Box, Button, ButtonGroup, CircularProgress, Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import React from 'react'
import { ApiGroupDto } from '../../../../api/dtos/group/ApiGroupDto';
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import { Work, Workspaces } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import useAuth from '../../../../hooks/auth/useAuth';
import { GroupApi, SongsApi } from '../../../../api/generated';
import { useApiState, useApiStateEffect } from '../../../../tech/ApiState';
import { handleApiCall } from '../../../../tech/handleApiCall';

interface Buttons13kaProps {
    variant: VariantDTO
}

export default function Buttons13ka(props: Buttons13kaProps) {

    // const {fetch, post: postData} = useFetch();
    // const [loading, setLoading] = React.useState(false);
    const {apiConfiguration} = useAuth();
    const groupApi = new GroupApi(apiConfiguration);
    const songsApi = new SongsApi(apiConfiguration);
    const {fetchApiState, apiState} = useApiState<boolean | undefined>();
    const [{
        data,
        loading
    }] = useApiStateEffect(()=>{
        return handleApiCall(groupApi.groupControllerGetGroupInfo(undefined, "13ka"));
    })

    const {enqueueSnackbar} = useSnackbar();

    const addTo13ka = async () => {
        fetchApiState(async ()=>{
            if(!data?.selection) return;
            return handleApiCall(songsApi.songsControllerAddVariantToPlaylist({
                playlist: data.selection,
                variant: props.variant.guid
            }))
            .catch((e)=>{
                console.log(e);
                return undefined;
            })
        },(r)=>{
            if(r) enqueueSnackbar("Píseň byla přidána do 13ky");
            else enqueueSnackbar("Píseň již byla přidána.");
        })

    }
    const removeFrom13ka = async () => {
        fetchApiState(async ()=>{
            if(!data?.selection) return;
            return handleApiCall(
                songsApi.songsControllerRemoveVariantFromPlaylistDelete(
                    props.variant.guid, data.selection))
            .catch((e)=>{
                console.log(e);
                return undefined;
            });
        },(r)=>{
            if(r) enqueueSnackbar("Píseň byla odebrána ze 13ky");
            else enqueueSnackbar("Píseň nebyla ve skupině nalezena.");
        })
    }

    interface CustomButtonProps {
        title:string,
        onClick: () => void,
        loading?: boolean
    }

    const CustomButton = (props: CustomButtonProps) => {
        return <MenuItem
            onClick={props.onClick}
            disabled={loading}>
            <ListItemIcon>
                {!loading?<>
                    <Workspaces color='secondary'/>
                </>:<>
                    <CircularProgress size={20} color='secondary'/>
                </>}
            </ListItemIcon>
            <ListItemText 
                primary={props.title}/>
        </MenuItem>
    }
  
  return (
    <>
            <CustomButton
                title='Odebrat ze 13ky'
                onClick={removeFrom13ka}
                loading={loading}/>

            
            <CustomButton
                title='Přidat 13ky'
                onClick={addTo13ka}
                loading={loading}/>

            <Divider/>
    </>
  )
}

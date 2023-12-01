import React, { useMemo } from 'react'
import TransposePanel from '../TransposePanel'
import { Box } from '@mui/material'
import useAuth from '../../../hooks/auth/useAuth'
import VerifyButton from './components/VerifyButton'
import { VariantDTO } from '../../../interfaces/variant/VariantDTO';
import SheetAdminButtons from './components/SheetAdminButtons'
import { Sheet } from '@pepavlin/sheet-api'
import Song from '../../../interfaces/song/song'
import AddToPlaylistButton from './components/AddToPlaylistButton'
import PrintButton from './components/PrintButton'
import Buttons13ka from './components/Buttons13ka'
import ChangeVariant from './components/ChangeVariant'
import EditButton from './components/EditButton'
import { fetchData } from '../../../tech/fetchHelpers';
import useFetch from '../../../hooks/useFetch'
import { POSTEDITVARIANT_URL } from '../../../api/constants'
import { PostEditVariantBody } from '../../../api/dtos/dtosSong'
import { isRequestSuccess } from '../../../api/dtos/RequestResult'
import { useSnackbar } from 'notistack'

interface TopPanelProps {
    transpose: (i:number)=>void,
    variant: VariantDTO,
    reloadSong: ()=>void,
    sheet: Sheet,
    title: string,
    editedTitle: string,
    song: Song,
    variantIndex: number
    onChangeVariant: (i:number)=>void,
    onEditClick?: (editable: boolean)=>void,
    isInEditMode?: boolean,

}

export default function TopPanel(props: TopPanelProps) {

    const {isAdmin, isTrustee, isLoggedIn, user} = useAuth()

    const isOwner = useMemo(()=>{
        if(!user) return false;
        return props.variant.createdBy === user?.guid
    }, [user]);

    const {enqueueSnackbar} = useSnackbar();
    const {fetchData, post} = useFetch();

    const [saving, setSaving] = React.useState(false);

    const onEditClick = async (editable: boolean) => {
        
        if(editable){
            if(props.variant.verified){
                enqueueSnackbar("Nelze upravit veřejenou píseň.")
                return;
            }
            props.onEditClick?.(editable);
            return;
        };

        props.onEditClick?.(editable);
        setSaving(true);

        const body : PostEditVariantBody = {
            guid: props.variant.guid,
            sheetData: props.sheet.getOriginalSheetData(),
            title: props.title
        }
        const result = await post({url: POSTEDITVARIANT_URL, body})

        if(isRequestSuccess(result)){
            props.reloadSong();
            enqueueSnackbar("Píseň uložena.", {variant: "default"})
        }else{
            enqueueSnackbar("Not saved! " + result.message, {variant: "error"})
        }

        setSaving(false);


    }
        
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
        }}>
            {props.isInEditMode ? <>
                
                <Box flex={1}/>
                
                    <EditButton 
                        onClick={onEditClick} 
                        inEditMode={props.isInEditMode} 
                        loading={saving}
                        sheetData={props.sheet?.getOriginalSheetData() || ""}
                        title={props.editedTitle}/>

            </> : <>
                
                    <TransposePanel transpose={props.transpose}/>
                
                    {isAdmin()&&props.song.variants.length>1&&<>
                        <ChangeVariant 
                            index={props.variantIndex}
                            onChange={props.onChangeVariant}
                            variants={props.song.variants}/>
                    </>}
                
                    {(isAdmin()||isTrustee())&&!saving&&<>
                        <VerifyButton variant={props.variant} reloadSong={props.reloadSong}/>
                    </>}
                
                    <Box flex={1}/>
                
                    {isOwner||(isAdmin()&&props.variant.createdByLoader)&&<>
                        <EditButton 
                            onClick={onEditClick} 
                            inEditMode={props.isInEditMode} 
                            loading={saving}
                            sheetData={props.sheet?.getOriginalSheetData()||""}
                            title={props.editedTitle}/>
                    </>}
                    
                    {isAdmin()&&<>
                        <SheetAdminButtons 
                            sheet={props.sheet} 
                            song={props.song} 
                            reload={props.reloadSong}
                            variant={props.variant}/>
                    </>}
                
                    {isLoggedIn()&&<>
                        <AddToPlaylistButton variant={props.variant}/>
                    </>}
                
                    <PrintButton/>
            </>}
        </Box>
    )
}

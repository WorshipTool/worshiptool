import React, { useEffect } from 'react'
import SongListCards from '../../../../../components/songLists/SongListCards/SongListCards'
import { VariantDTO } from '../../../../../interfaces/variant/VariantDTO';
import SheetGraphics from '../../../../Sheet/SheetGraphics';
import DefaultStyle from '../../../../../components/SheetDisplay/styles/DefaultStyle';
import { Sheet } from '@pepavlin/sheet-api';
import { Box } from '@mui/material';
import UploadSheetEditable from './UploadSheetEditable';
import { EasySheet } from '../Upload';

interface SheetListPreviewProps {
    sheets: EasySheet[],
    onChange: (sheets: EasySheet[]) => void,
}

export default function SheetListPreview(props: SheetListPreviewProps) {
    const [sheets, setSheets] = React.useState<EasySheet[]>(props.sheets);

    useEffect(()=>{
        setSheets(props.sheets);
    }, [props.sheets])

  return (
    <Box sx={{
        display:"flex",
        flexDirection:"column",
        flexWrap:"wrap",
    }}>
        {sheets.map((sheet, index)=>{
            return (
                <div key={"sheet"+sheet.randomHash}>
                    <UploadSheetEditable title={sheet.title} data={sheet.data} onDelete={()=>{
                        const newSheets = [...props.sheets];
                        newSheets.splice(index, 1);
                        props.onChange(newSheets);
                    }} onChange={(title, data)=>{
                        const newSheets = [...props.sheets];
                        newSheets[index].title = title;
                        newSheets[index].data = data
                        props.onChange(newSheets);
                    }} originalFile={sheet.originalFile}></UploadSheetEditable>
                </div>
            )
        })}
    </Box>
  )
}

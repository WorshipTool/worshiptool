import React, { useEffect } from 'react'
import SongListCards from '../../../../../components/songLists/SongListCards/SongListCards'
import { VariantDTO } from '../../../../../interfaces/variant/VariantDTO';
import SheetGraphics from '../../../../Sheet/SheetGraphics';
import DefaultStyle from '../../../../Sheet/styles/DefaultStyle';
import { Sheet } from '@pepavlin/sheet-api';
import { Box } from '@mui/material';

interface SheetListPreviewProps {
    sheets: {
        title: string,
        data: string,
    }[]
}

export default function SheetListPreview(props: SheetListPreviewProps) {
    const [sheets, setSheets] = React.useState<Sheet[]>([]);

    useEffect(()=>{
        const sheets = props.sheets.map((sheetData)=>{
            const sheet = new Sheet(sheetData.data);
            return sheet;
        })
        setSheets(sheets);
    }, [props.sheets])

  return (
    <Box sx={{
        display:"flex",
        flexDirection:"column",
        flexWrap:"wrap",
    }}>
        {sheets.map((sheet, index)=>{
            return (
                <div key={"sheet"+index}>
                    <DefaultStyle sheet={sheet} title={props.sheets[index].title}></DefaultStyle>
                </div>
            )
        })}
    </Box>
  )
}

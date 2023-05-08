import Song, { Section } from "../../models/song/song";
import {convertSheetToSections} from "@pepavlin/sheet-api";
import AllSongDataDTO from "../dtos/dtosSong";

export default function convertAllSongDataDTOToSong(d: AllSongDataDTO) : Song{
    const data = d;

    if(data===undefined){
        return {} as Song
    }



    return {
        guid: data.guid,
        title: data.mainTitle,
        creators: data.creators,
        variants: data.variants.filter((v)=>v).map((variant)=>{


            let sections : Section[] = [];
            if(variant.sheetData)
                sections = convertSheetToSections(variant.sheetData)

            return {
                guid: variant.guid,
                preferredTitle: variant.prefferedTitle,
                titles: variant.titles,
                sheetData: variant.sheetData,
                sheetText: variant.sheetText,
                sections,
                verified: variant.verified,
                createdBy: variant.createdBy,
                createdByLoader: variant.createdByLoader,
                sources: variant.sources,
                creators: variant.creators
            }
        }),
        media: d.media,
        tags: d.tags
    }
}

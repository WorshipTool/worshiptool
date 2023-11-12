import { Sheet } from "@pepavlin/sheet-api";
import Song from "../interfaces/song/song";
import AllSongDataDTO from "./dtos/dtosSong";

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


            const sheet = new Sheet(variant.sheetData);
            let sections = sheet.getSections();
      

            return {
                guid: variant.guid,
                songGuid: "notimplemented",
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
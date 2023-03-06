import Song, { Section } from "../../models/song/song";
import convertSheetToSections from "../../sheetApi/conversition/convertSheetToSections";
import AllSongDataDTO from "../dtos/dtosSong";

export default function convertAllSongDataDTOToSong(d: AllSongDataDTO) : Song{
    const data = d;

    if(data===undefined){
        return {} as Song
    }



    return {
        guid: data.guid,
        title: data.mainTitle,
        alternativeTitles: data.alternativeTitles,
        creators: data.creators,
        variants: data.variants.filter((v)=>v).map((variant)=>{


            let sections : Section[] = [];
            if(variant.sheetData)
                sections = convertSheetToSections(variant.sheetData)

            return {
                guid: variant.guid,
                preferredTitle: variant.prefferedTitle,
                sheetData: variant.sheetData,
                sheetText: variant.sheetText,
                sections,
                verified: variant.verified,
                createdBy: variant.createdBy,
                sources: variant.sources,
                creators: variant.creators
            }
        }),
        media: d.media,
        tags: d.tags
    }
}

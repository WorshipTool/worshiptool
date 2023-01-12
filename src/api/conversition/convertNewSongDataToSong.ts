import Song from "../../models/song";
import convertSheetToSections from "./convertSheetToSections";

export interface newSongData{
    title: string, 
    alternativeTitles: string[], 
    sheet: string
}

export default function convertNewSongDataToSong(data: newSongData):Song{

    const sections = convertSheetToSections(data.sheet);
    const s: Song = {
        title: data.title,
        alternativeTitles: data.alternativeTitles,
        variants: [
            {
                preferredTitle: data.title,
                sheet: data.sheet,
                sheetText: sections.map((s)=>s.text).join("\n"),
                sections
            }
        ],
        creators: []

    };

    return s;
}
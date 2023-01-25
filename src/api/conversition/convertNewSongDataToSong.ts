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
        guid: "",
        title: data.title,
        alternativeTitles: data.alternativeTitles,
        variants: [
            {
                guid: "",
                preferredTitle: data.title,
                sheetData: data.sheet,
                sheetText: sections.map((s)=>s.text).join("\n"),
                sections,
                verified: false,
                createdBy: ""
            }
        ],
        creators: []

    };

    return s;
}
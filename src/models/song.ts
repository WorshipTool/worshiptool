import chord from "../api/models/chord"

export default interface Song{
    guid:string,
    title: string,
    alternativeTitles: string[],
    creators: {
        name: string, 
        type: string
    }[],
    variants: Variant[]
}

export interface Variant{
    guid:string,
    sheetData: string,
    sheetText: string,
    sections: Section[],
    preferredTitle: string
}

export interface Segment {
    chord?: chord,
    text?: string
}
export interface Line {
    segments: Segment[],
    text? : string
}
export interface Section {
    name?: string,
    lines?: Line[],
    text? : string
}


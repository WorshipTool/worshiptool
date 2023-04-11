import { chordData } from "@pepavlin/sheet-api"
import { Creator } from "./creator"
import { Media } from "./media"
import { Source } from "./source"

export default interface Song{
    guid:string,
    title: string,
    alternativeTitles: string[],
    creators: Creator[],
    variants: Variant[],
    media: Media[],
    tags: string[]

}

export interface Variant{
    guid:string,
    sheetData: string,
    sheetText: string,
    sections: Section[],
    preferredTitle: string,
    verified: boolean,
    createdBy: string,
    createdByLoader: boolean,
    sources: Source[],
    creators: Creator[]
}

export interface Segment {
    chord?: chordData,
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


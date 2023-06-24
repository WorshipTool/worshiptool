import { Section } from "@pepavlin/sheet-api";
import { Source } from "./source";
import { Creator } from "./creator";

export interface Variant{
    guid:string,
    sheetData: string,
    sheetText: string,
    sections: Section[],
    preferredTitle: string,
    titles: string[],
    verified: boolean,
    createdBy: string,
    createdByLoader: boolean,
    sources: Source[],
    creators: Creator[]
}
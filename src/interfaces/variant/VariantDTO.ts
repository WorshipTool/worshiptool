import { Section } from "@pepavlin/sheet-api";
import { Source } from "../song/source";
import { Creator } from "../song/creator";

export interface VariantDTO{
    guid:string,
    songGuid:string,
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
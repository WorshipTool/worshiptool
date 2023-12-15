import { Source } from "../song/source";
import { Creator } from "../song/creator";
import { Section } from "@pepavlin/sheet-api/lib/sheetApi/conversition/song";

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
    creators: Creator[],
    deleted: boolean,
}
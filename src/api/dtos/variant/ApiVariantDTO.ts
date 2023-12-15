import { ApiCreatorDTO } from "../creator/ApiCreatorDTO";
import { ApiSourceDTO } from "../source/ApiSourceDTO";

export interface ApiVariantDTO{
    guid:string,
    songGuid:string,
    prefferedTitle: string,
    titles: string[],
    sheetData: string,
    sheetText: string,
    verified:boolean,
    createdByGuid:string,
    createdByLoader:boolean,
    sources: ApiSourceDTO[],
    creators: ApiCreatorDTO[],
    deleted:boolean,
}


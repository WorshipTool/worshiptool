import { Sheet } from "@pepavlin/sheet-api";
import { SourceDto } from "../source/SourceDto";
import { CreatorDto } from "../creator/CreatorDto";

export type SongVariantDto = {
    guid: string;
    sheetData: string;
    sheetText: string;
    sheet: Sheet;
    preferredTitle: string;
    titles: string[];
    verified: boolean;
    public: boolean;
    deleted: boolean;
    createdBy: string;
    createdByLoader: boolean;
    sources: SourceDto[];
    creators: CreatorDto[];
    alias: string;
};

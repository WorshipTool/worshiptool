import { ApiVariantDTO } from "./ApiVariantDTO";
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import { Sheet } from "@pepavlin/sheet-api";

export const mapApiToVariant = (api: ApiVariantDTO) : VariantDTO => {
    const sheet = new Sheet(api.sheetData);
    return {
        guid: api.guid,
        songGuid: api.songGuid,
        sheetData: api.sheetData,
        sheetText: api.sheetText,
        sections: sheet.getSections(),
        preferredTitle: api.prefferedTitle,
        titles: api.titles,
        verified: api.verified,
        createdBy: api.createdByGuid,
        createdByLoader: api.createdByLoader,
        sources: api.sources,
        creators: api.creators
    }
}
import { convertSheetToSections } from "@pepavlin/sheet-api";
import { ApiVariantDTO } from "./ApiVariantDTO";
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";

export const mapApiToVariant = (api: ApiVariantDTO) : VariantDTO => {
    return {
        guid: api.guid,
        songGuid: api.songGuid,
        sheetData: api.sheetData,
        sheetText: api.sheetText,
        sections: convertSheetToSections(api.sheetData),
        preferredTitle: api.prefferedTitle,
        titles: api.titles,
        verified: api.verified,
        createdBy: api.createdByGuid,
        createdByLoader: api.createdByLoader,
        sources: api.sources,
        creators: api.creators
    }
}
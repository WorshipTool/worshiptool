import { Sheet } from "@pepavlin/sheet-api";
import {
    SearchResult,
    SearchSongData,
    SongDataVariant,
    SongVariantDataOutDto
} from "../../generated";
import { SongVariantDto } from "./songVariant.dto";
import { mapApiToVariant } from "./mapApiToVariant";

export const mapSongDataVariantApiToSongVariantDto = (
    api: SongDataVariant
): SongVariantDto => {
    return {
        ...api,
        preferredTitle: api.prefferedTitle,
        sheet: new Sheet(api.sheetData),
        createdBy: api.createdByGuid,
        public: api.verified || api.createdByLoader
    };
};

export const mapSongVariantDataOutDtoToSongVariantDto = (
    api: SongVariantDataOutDto
): SongVariantDto => {
    return {
        ...api,
        preferredTitle: api.prefferedTitle,
        sheet: new Sheet(api.sheetData),
        createdBy: api.createdBy,
        public: api.verified || api.createdByLoader
    };
};

export const mapSearchSongDataApiToSongVariantDto = (
    data: SearchSongData
): SongVariantDto => {
    return {
        ...data.variant,
        sheet: new Sheet(data.variant.sheetData),
        preferredTitle: data.variant.prefferedTitle,
        createdBy: data.variant.createdByGuid,
        public: data.variant.verified || data.variant.createdByLoader
    };
};

export const mapSearchResultApiToSongVariantDtoArr = (
    result: SearchResult
): SongVariantDto[] => {
    return result.songs.map((data) => {
        const variant = data.variant;
        const v: SongVariantDto = {
            ...variant,
            sheet: new Sheet(variant.sheetData),
            preferredTitle: variant.prefferedTitle,
            createdBy: variant.createdByGuid,
            alias: data.alias,
            public: variant.verified || variant.createdByLoader
        };
        return v;
    });
};

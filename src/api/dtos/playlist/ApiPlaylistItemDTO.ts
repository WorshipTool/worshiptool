import { ApiVariantDTO } from "../variant/ApiVariantDTO";

export interface ApiPlaylistItemDTO {
    guid: string;
    toneKey: string;
    order: number;
    variant: ApiVariantDTO;
}
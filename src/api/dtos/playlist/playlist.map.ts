import { note } from "@pepavlin/sheet-api";
import { PlaylistItemDTO } from "../../../interfaces/playlist/PlaylistDTO";
import { PlaylistItemDTO as pid } from "../../generated";
import { mapSongVariantDtoApiToSongVariantDto } from "../variant";

export const mapPlaylistItemDtoApiToPlaylistItemDto = (
    api: pid
): PlaylistItemDTO => {
    return {
        guid: api.guid,
        toneKey: api.toneKey as note,
        order: api.order,
        variant: mapSongVariantDtoApiToSongVariantDto(api.variant)
    };
};

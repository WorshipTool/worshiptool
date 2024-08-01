import { note } from "@pepavlin/sheet-api";
import { PlaylistItemDTO } from "../../../interfaces/playlist/PlaylistDTO";
import { PlaylistItemOutDto } from "../../generated";
import { mapSongVariantDataOutDtoToSongVariantDto } from "../variant";

export const mapPlaylistItemOutDtoApiToPlaylistItemDto = (
    api: PlaylistItemOutDto
): PlaylistItemDTO => {
    return {
        guid: api.guid,
        toneKey: api.toneKey as note,
        order: api.order,
        variant: mapSongVariantDataOutDtoToSongVariantDto(api.variant)
    };
};

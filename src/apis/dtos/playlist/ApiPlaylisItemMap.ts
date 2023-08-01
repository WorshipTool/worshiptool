import { note } from "@pepavlin/sheet-api";
import { PlaylistItemDTO } from "../../../interfaces/playlist/PlaylistDTO";
import { ApiPlaylistItemDTO } from "./ApiPlaylistItemDTO";
import { mapApiToVariant } from "../variant/mapApiToVariant";

export const mapApiToPlaylistItemDTO = (api: ApiPlaylistItemDTO) : PlaylistItemDTO => {
    return {
        guid: api.guid,
        toneKey: api.toneKey as note,
        order: api.order,
        variant: mapApiToVariant(api.variant)

    }
}
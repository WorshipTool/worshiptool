import { GetSongDataOutDto } from "../../generated";
import { mapSongDataVariantApiToSongVariantDto } from "../variant/songVariant.map";
import { SongDto } from "./song.dto";

export const mapGetSongDataApiToSongDto = (api: GetSongDataOutDto): SongDto => {
	return {
		guid: api.guid,
		title: api.mainTitle,
		variants: api.variants.map((v) =>
			mapSongDataVariantApiToSongVariantDto(v)
		),
		media: api.media,
		tags: api.tags
	};
};

import { CreatorDto } from "../creator/CreatorDto";
import { MediaDto } from "../media/MediaDto";
import { SongVariantDto } from "../variant/songVariant.dto";

export type SongDto = {
	guid: string;
	title: string;
	variants: SongVariantDto[];
	media: MediaDto[];
	tags: string[];
};

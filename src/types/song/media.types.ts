export enum MediaTypes {
	'Youtube' = 0,
	'Unknown' = 1,
	'Spotify' = 2,
}

export interface MediaData {
	type: MediaTypes
	url: string
	guid: string
}

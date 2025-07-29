export enum CreatorType {
	'Author',
}

export type CreatorDto = {
	name: string
	type: CreatorType
}

export type CreatorGuid = string & {
	readonly _: unique symbol
}
export type CreatorAutocompleteItemDto = {
	name: string
	guid: CreatorGuid
}
export type CreatorAutocompleteDto = {
	items: CreatorAutocompleteItemDto[]
}

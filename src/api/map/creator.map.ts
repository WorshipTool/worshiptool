import {
	CreatorAutocompleteDto,
	CreatorGuid,
} from '@/api/dtos/creator/CreatorDto'
import { GetCreatorAutoCompleteItemDto } from '@/api/generated'

export const mapCreatorAutocompleteApiToDto = (
	api: GetCreatorAutoCompleteItemDto[]
): CreatorAutocompleteDto => {
	return {
		items: api.map((item) => ({
			name: item.name,
			guid: item.guid as CreatorGuid,
		})),
	}
}

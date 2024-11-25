import { Sheet } from '@pepavlin/sheet-api'
import {
	SongVariantDto,
	SongVariantGuid,
	VariantPackAlias,
} from '../../../api/dtos'
import { createStory } from '../../../app/(layout)/storybook/createStory'
import { SongCard } from './SongCard'

const SongCardStory = () => {
	const data: SongVariantDto = {
		guid: 'guid' as SongVariantGuid,
		preferredTitle: 'Lorem ipsum',
		sheet: new Sheet(
			'{V1}Lorem ipsum[C] \nnechodim na uprum\nTestovaci akordy[Am]'
		),
		packAlias: '13adf4-asf-akaj' as VariantPackAlias,
		public: false,
	} as SongVariantDto

	return <SongCard data={data} />
}

createStory(SongCard, SongCardStory)

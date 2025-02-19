import { Sheet } from '@pepavlin/sheet-api'
import {
	BasicVariantPack,
	VariantPackAlias,
	VariantPackGuid,
} from '../../../api/dtos'
import { createStory } from '../../../app/(layout)/storybook/createStory'
import { SongCard } from './SongCard'

const SongCardStory = () => {
	const data: BasicVariantPack = {
		packGuid: 'guid' as VariantPackGuid,
		title: 'Lorem ipsum',
		sheet: new Sheet(
			'{V1}Lorem ipsum[C] \nnechodim na uprum\nTestovaci akordy[Am]'
		),
		packAlias: '13adf4-asf-akaj' as VariantPackAlias,
		public: false,
	} as any as BasicVariantPack

	return <SongCard data={data} />
}

createStory(SongCard, SongCardStory)

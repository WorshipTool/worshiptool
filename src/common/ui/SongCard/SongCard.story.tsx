import {
	BasicVariantPack,
	VariantPackAlias,
	VariantPackGuid,
} from '../../../api/dtos'
import { createStory } from '../../../app/(layout)/storybook/createStory'
import { SongVariantCard } from './SongVariantCard'

const SongCardStory = () => {
	const data: BasicVariantPack = {
		packGuid: 'guid' as VariantPackGuid,
		title: 'Lorem ipsum',
		sheetData: '{V1}Lorem ipsum[C] \nnechodim na uprum\nTestovaci akordy[Am]',
		packAlias: '13adf4-asf-akaj' as VariantPackAlias,
		public: false,
	} as BasicVariantPack

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<SongVariantCard data={data} />
			<SongVariantCard data={data} dense />
		</div>
	)
}

createStory(SongVariantCard, SongCardStory)

import { Sheet } from '@pepavlin/sheet-api'
import { SongVariantDto } from '../../../api/dtos'
import { createStory } from '../../../app/storybook/createStory'
import { SongCard } from './SongCard'

const SongCardStory = () => {
	return (
		<SongCard
			data={
				{
					guid: 'guid',
					preferredTitle: 'Lorem ipsum',
					sheet: new Sheet(
						'{V1}Lorem ipsum[C] \nnechodim na uprum\nTestovaci akordy[Am]'
					),
					alias: '13adf4-asf-akaj',
					public: false,
				} as SongVariantDto
			}
			publicityMode="all"
		/>
	)
}

createStory(SongCard, SongCardStory)

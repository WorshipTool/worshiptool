'use client'

import { createStory } from '@/app/(layout)/storybook/createStory'
import MobileSearchBody, {
	MobileSearchEntry,
	MobileSearchField,
} from '@/app/components/MobileSearch'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { Box, Typography } from '@/common/ui'
import { useState } from 'react'

const FRAME_WIDTH = 390

/**
 * Playground for the phone's search bar and the body it swaps home's
 * recommendations for. Both render inline now that searching is a mode of the
 * home screen rather than a full-screen layer, so this is the real thing at
 * phone width rather than a launcher.
 *
 * It owns the query state the same way HomeDesktop does in the real app (raw
 * value + a "debounced" one), so typing here exercises the same code path.
 */
const MobileSearchStory = () => {
	const [open, setOpen] = useState(true)
	const [value, setValue] = useState('')
	const recommended = useRecommendedSongs()

	return (
		<Box
			data-testid="mobile-search"
			sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
		>
			<Typography small color="grey.600">
				Zrušit vrátí bar do klidového stavu — na úvodce zároveň vrátí hero a
				doporučené písně.
			</Typography>
			<Box
				sx={{
					width: FRAME_WIDTH,
					maxWidth: '100%',
					bgcolor: 'grey.50',
					border: '1px solid',
					borderColor: 'grey.300',
					borderRadius: 3,
					padding: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				{open ? (
					<MobileSearchField
						value={value}
						onValueChange={setValue}
						onCancel={() => {
							setValue('')
							setOpen(false)
						}}
					/>
				) : (
					<MobileSearchEntry onOpen={() => setOpen(true)} />
				)}

				{open && (
					<MobileSearchBody
						searchString={value.trim() ? value : null}
						smartSearch={false}
						suggestions={recommended.data.slice(0, 5)}
					/>
				)}
			</Box>
		</Box>
	)
}

createStory(MobileSearchStory, MobileSearchStory)

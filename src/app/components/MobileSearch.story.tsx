'use client'

import { createStory } from '@/app/(layout)/storybook/createStory'
import MobileSearchBody, {
	MobileSearchBar,
} from '@/app/components/MobileSearch'
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
	const [active, setActive] = useState(false)
	const [value, setValue] = useState('')

	return (
		<Box
			data-testid="mobile-search"
			sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
		>
			<Typography small color="grey.600">
				Je to jeden prvek: focus ho aktivuje a Zrušit ho vrátí do klidu — na
				úvodce se zároveň složí hero a vrátí doporučené písně.
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
				<MobileSearchBar
					value={value}
					onValueChange={setValue}
					active={active}
					onActivate={() => setActive(true)}
					onCancel={() => {
						setValue('')
						setActive(false)
					}}
				/>

				{active && (
					<MobileSearchBody
						searchString={value.trim() ? value : null}
						smartSearch={false}
					/>
				)}
			</Box>
		</Box>
	)
}

createStory(MobileSearchStory, MobileSearchStory)

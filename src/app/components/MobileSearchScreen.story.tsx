'use client'

import { createStory } from '@/app/(layout)/storybook/createStory'
import MobileSearchScreen from '@/app/components/MobileSearchScreen'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { Box, Button, Typography } from '@/common/ui'
import { useState } from 'react'

/**
 * Playground for the phone search layer, so its design can be iterated without
 * touching the home screen.
 *
 * The layer is fixed and full-bleed, so it cannot render inline in the gallery —
 * the story is a launcher instead. It owns the query state the same way
 * HomeDesktop does in the real app (raw value + a "debounced" one), so typing
 * here exercises the same code path.
 *
 * Only renders the layer on phone widths; on desktop the component hides itself.
 */
const MobileSearchScreenStory = () => {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState('')
	const recommended = useRecommendedSongs()

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Typography small color="grey.600">
				Otevře se přes celou obrazovku. Zavřít lze zatím jen tlačítkem Zpět —
				viz otevřená otázka kolem odchodu z hledání.
			</Typography>
			<Box>
				<Button onClick={() => setOpen(true)} disableUppercase>
					Otevřít hledání
				</Button>
			</Box>

			{open && (
				<>
					<MobileSearchScreen
						value={value}
						onValueChange={setValue}
						searchString={value.trim() ? value : null}
						smartSearch={false}
						suggestions={recommended.data.slice(0, 5)}
					/>
					{/* the layer has no exit of its own yet, so the playground keeps one */}
					<Box
						sx={{
							position: 'fixed',
							top: 8,
							right: 8,
							zIndex: 2000,
						}}
					>
						<Button onClick={() => setOpen(false)} disableUppercase>
							Zavřít (jen v playgroundu)
						</Button>
					</Box>
				</>
			)}
		</Box>
	)
}

createStory(MobileSearchScreen, MobileSearchScreenStory)

'use client'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { useInnerPack } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import { useInnerSong } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import SongSelectPopup from '@/common/components/SongSelectPopup/SongSelectPopup'
import { Box, Button, Clickable, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { czechConjugation } from '@/tech/string/string.tech'
import { BasicVariantPack } from '@/types/song'
import { useRef, useState } from 'react'

export default function ParentSongSection() {
	const { data, loading } = useInnerSong()
	const [isPopupOpen, setPopupOpen] = useState(false)
	const { songManagementApi } = useApi() // Corrected to use the `useApi` hook properly
	const { packGuid } = useInnerPack()

	const handleSelectParent = async (newParentGuid: string) => {
		// try {
		// 	await api.songMergingControllerMergeSongs({
		// 		currentSongGuid: data.guid,
		// 		newParentGuid,
		// 	})
		// 	alert('Parent song updated successfully!')
		// 	setPopupOpen(false)
		// } catch (error) {
		// 	console.error('Failed to update parent song:', error)
		// 	alert('Failed to update parent song.')
		// }
	}

	const anchorRef = useRef(null)

	const onSubmit = async (packs: BasicVariantPack[]) => {
		await songManagementApi.songMergingControllerMovePacksToFamily({
			packGuids: [packGuid],
			targetSongGuid: packs[0].songGuid,
		})

		window.location.reload()
	}

	const addToEmptyFamily = async () => {
		await songManagementApi.songMergingControllerMovePacksToFamily({
			packGuids: [packGuid],
		})

		window.location.reload()
	}

	return loading || !data ? null : (
		<Box sx={{ position: 'relative' }}>
			<Typography small>
				Parent píseň{' '}
				{`- ${data.packs.length - 1} ${czechConjugation(
					'další varianta',
					'další varianty',
					'dalších variant',
					data.packs.length - 1
				)}`}
			</Typography>
			<Box display="flex" gap={2} alignItems="center">
				<Link to="adminSong" params={{ songGuid: data.guid }}>
					<Clickable>
						<Typography strong>{data.title}</Typography>
					</Clickable>
				</Link>
				<Button
					onClick={() => setPopupOpen(true)}
					ref={(r) => {
						anchorRef.current = r as any
					}}
					small
					outlined
				>
					Vybrat jinou píseň
				</Button>
				<Button onClick={addToEmptyFamily} small outlined>
					Přidat do prázdné rodiny
				</Button>
			</Box>

			<SongSelectPopup
				open={isPopupOpen}
				onClose={() => setPopupOpen(false)}
				onSubmit={onSubmit}
				anchorRef={anchorRef}
				submitLabel="Přidat do rodiny"
				disableMultiselect
			/>
		</Box>
	)
}

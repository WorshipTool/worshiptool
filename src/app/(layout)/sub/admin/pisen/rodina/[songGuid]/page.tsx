'use client'
import { useInnerSong } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import SongListCard from '@/common/components/songLists/SongListCards/SongListCards'
import SongSelectPopup from '@/common/components/SongSelectPopup/SongSelectPopup'
import { Box, Button, Typography } from '@/common/ui'
import { useApi } from '@/hooks/api/useApi'
import { parseVariantAlias } from '@/routes/routes.tech'
import { handleApiCall } from '@/tech/handleApiCall'
import { BasicVariantPack } from '@/types/song'
import { Add } from '@mui/icons-material'
import { useMemo, useRef, useState } from 'react'
export default SmartPage(Page, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

function Page() {
	const { data } = useInnerSong()

	const [inChooseMode, setInChooseMode] = useState(false)

	const [selectedPacks, setSelectedPacks] = useState<BasicVariantPack[]>([])
	const cancelSelection = () => {
		setInChooseMode(false)
		setSelectedPacks([])
	}

	const onSelect = (pack: BasicVariantPack, select: boolean) => {
		if (select) {
			setSelectedPacks((prev) => [...prev, pack])
		} else {
			setSelectedPacks((prev) =>
				prev.filter((p) => p.packGuid !== pack.packGuid)
			)
		}
	}

	const list = useMemo(() => {
		return (
			<SongListCard
				data={data?.packs || []}
				cardToLinkProps={(data) => ({
					to: 'adminPack',
					params: {
						...parseVariantAlias(data.packAlias),
					},
				})}
				selectable={inChooseMode}
				onCardSelect={(d) => onSelect(d, true)}
				onCardDeselect={(d) => onSelect(d, false)}
			/>
		)
	}, [data, inChooseMode])

	const { songManagementApi } = useApi()
	const onRemoveClick = () => {
		// TODO: Smart remove and transfer to another song
		handleApiCall(
			songManagementApi.songMergingControllerMovePacksToFamily({
				packGuids: selectedPacks.map((p) => p.packGuid),
			})
		)

		cancelSelection()

		window.location.reload()
	}

	const onSongSubmit = async (packs: BasicVariantPack[]) => {
		if (!data) return
		await handleApiCall(
			songManagementApi.songMergingControllerMovePacksToFamily({
				packGuids: packs.map((p) => p.packGuid),
				targetSongGuid: data.guid,
			})
		)

		window.location.reload()
	}

	const addRef = useRef(null)
	const [addPopupOpen, setAddPopupOpen] = useState(false)

	const mergeRef = useRef(null)
	const [mergePopupOpen, setMergePopupOpen] = useState(false)

	const onMergeSubmit = async (packs: BasicVariantPack[]) => {
		if (!data) return
		await handleApiCall(
			songManagementApi.songMergingControllerMergeFamilies({
				songGuids: [data.guid, ...packs.map((p) => p.songGuid)],
			})
		)
		window.location.reload()
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}
		>
			<Box display={'flex'} gap={2} alignItems={'center'}>
				<Typography variant="h5">{data?.title}</Typography>
				<Button
					small
					outlined
					onClick={() => setMergePopupOpen(true)}
					ref={mergeRef}
				>
					Spojit s jinou rodinou
				</Button>
				<SongSelectPopup
					open={mergePopupOpen}
					anchorRef={mergeRef}
					onClose={() => setMergePopupOpen(false)}
					onSubmit={onMergeSubmit}
					filterFunc={(pack) => pack.songGuid !== data?.guid}
				/>
			</Box>

			<Box
				display={'flex'}
				gap={2}
				alignItems={'center'}
				justifyContent={'space-between'}
			>
				<Typography thin>Celkem {data?.packs.length} variant</Typography>
				{!inChooseMode ? (
					<Box display={'flex'} gap={2}>
						<>
							<Button
								small
								outlined
								startIcon={<Add />}
								ref={addRef}
								onClick={() => setAddPopupOpen(true)}
							>
								Přidat
							</Button>
							<SongSelectPopup
								open={addPopupOpen}
								anchorRef={addRef}
								onClose={() => setAddPopupOpen(false)}
								onSubmit={onSongSubmit}
								filterFunc={(pack) => pack.songGuid !== data?.guid}
							/>
						</>
						<Button small onClick={() => setInChooseMode(true)}>
							Zvolit
						</Button>
					</Box>
				) : (
					<Box display={'flex'} gap={2}>
						{
							<Button
								small
								color="error"
								outlined
								disabled={selectedPacks.length === 0}
								onClick={onRemoveClick}
							>
								Odebrat z rodiny
							</Button>
						}
						<Button small onClick={cancelSelection}>
							Zrušit
						</Button>
					</Box>
				)}
			</Box>

			{list}
		</Box>
	)
}

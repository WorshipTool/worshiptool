'use client'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import SearchFieldTeamZpevnik from '@/app/(subdomains)/sub/tymy/[alias]/zpevnik/components/SearchFieldTeamZpevnik'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import SongSelectPopup from '@/common/components/SongSelectPopup/SongSelectPopup'
import SongListCards from '@/common/components/songLists/SongListCards/SongListCards'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { Add } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { SongVariantDto, VariantPackGuid } from '@/api/dtos'
import { LinearProgress } from '@mui/material'
import './styles.css'

export default function TeamSongsPage() {
	const { selection } = useInnerTeam()
	const items = useMemo(() => {
		const items =
			selection.searchedItems.length > 0
				? selection.searchedItems
				: selection.items
		return items.map((item) => item.variant)
	}, [selection])

	const [selected, setSelected] = useState<VariantPackGuid[]>([])

	const [selectable, setSelectable] = useState(false)

	const [open, setOpen] = useState(false)

	const [thereHasBeenItems, setThereHasBeenItems] = useState(false)
	useEffect(() => {
		if (selection.loading) return

		// after one second, the popup will open
		const t = setTimeout(() => {
			if (selection.items.length === 0 && thereHasBeenItems === false)
				setOpen(true)
			else if (thereHasBeenItems === false) {
				setThereHasBeenItems(true)
			}
		}, 1000)

		return () => {
			clearTimeout(t)
		}
	}, [items, thereHasBeenItems])

	const filterFunc = useCallback(
		(pack: VariantPackGuid) => {
			return !items.some((i) => i.packGuid === pack)
		},
		[items]
	)

	const anchorRef = useRef(null)
	const [anchorName, setAnchorName] = useState('')

	const onAdd = () => {
		setOpen(true)
	}

	const onSongAddSubmit = (packs: VariantPackGuid[]) => {
		selection.addPacks(packs)
	}

	const onCardSelect = useCallback((d: SongVariantDto) => {
		setSelected((s) => {
			if (s.includes(d.packGuid)) return s
			return [...s, d.packGuid]
		})
		setSelectable(true)
	}, [])

	const onCardDeselect = useCallback((d: SongVariantDto) => {
		setSelected((s) => {
			return s.filter((v) => v !== d.packGuid)
		})
	}, [])

	const cardToProps = useCallback((data: SongVariantDto) => {
		return null
	}, [])

	const cancelSelect = useCallback(() => {
		setSelected([])
		setSelectable(false)
	}, [])

	const onRemoveSelected = useCallback(() => {
		selection.removePacks(selected)
		setSelected([])
		setSelectable(false)
	}, [selected])

	return (
		<div>
			<TeamPageTitle>Zpěvník</TeamPageTitle>

			<Box display={'flex'} flexDirection={'column'} gap={3}>
				{selection.loading && (
					<>
						<LinearProgress />
					</>
				)}
				{items.length > 0 && (
					<Box
						display={'flex'}
						flexDirection={'row'}
						justifyContent={'space-between'}
						gap={1}
					>
						<SearchFieldTeamZpevnik />
						<Box
							display={'flex'}
							flexDirection={'row'}
							justifyContent={'end'}
							gap={2}
						>
							{!selectable && (
								<Button
									variant="text"
									color="black"
									size="small"
									onClick={() => setSelectable(true)}
								>
									Vybrat
								</Button>
							)}
							<Box
								display={'flex'}
								ref={(r) => {
									anchorRef.current = r as any
									setAnchorName('addSongRight')
								}}
								position={'relative'}
							>
								<Button
									startIcon={<Add />}
									size="small"
									onClick={onAdd}
									variant="text"
									color="black"
									sx={{}}
								>
									Přidat píseň
								</Button>
							</Box>
						</Box>
					</Box>
				)}
				{selectable && (
					<Box
						display={'flex'}
						flexDirection={'row'}
						gap={1}
						alignItems={'center'}
						justifyContent={'space-between'}
					>
						<Box
							display={'flex'}
							flexDirection={'row'}
							gap={1}
							alignItems={'center'}
						>
							<Button
								variant="outlined"
								color="black"
								size="small"
								onClick={cancelSelect}
							>
								Zrušit výběr
							</Button>
							{selected.length === 0 ? (
								<Typography>Kliknutím vyberte písně</Typography>
							) : (
								<>
									<Box>
										<Typography>
											{selected.length === 1
												? `Vybrána 1 píseň`
												: selected.length < 5
												? `Vybrány ${selected.length} písně`
												: `Vybráno ${selected.length} písní`}
										</Typography>
									</Box>
								</>
							)}
						</Box>

						<Box>
							{/* Actions */}
							<Button color="error" size="small" onClick={onRemoveSelected}>
								Odstranit
							</Button>
						</Box>
					</Box>
				)}
				<SongListCards
					data={items}
					// cardToLinkProps={cardToProps}
					selectable={selectable}
					onCardSelect={onCardSelect}
					onCardDeselect={onCardDeselect}
				/>
				{items.length === 0 && (
					<Box gap={1} display={'flex'} flexDirection={'column'}>
						<Typography>Ve zpěvníku nejsou zatím žádné písně...</Typography>
						<Box
							display={'flex'}
							ref={(r) => {
								anchorRef.current = r as any
								setAnchorName('addFirstSongs')
							}}
						>
							<Button
								startIcon={<Add />}
								size="small"
								color="primary"
								onClick={onAdd}
							>
								Přidat píseň
							</Button>
						</Box>
					</Box>
				)}
				<Box>
					<SongSelectPopup
						open={open}
						onClose={() => setOpen(false)}
						onSubmit={onSongAddSubmit}
						anchorRef={anchorRef}
						anchorName={anchorName}
						filterFunc={filterFunc}
					/>
				</Box>
			</Box>
		</div>
	)
}

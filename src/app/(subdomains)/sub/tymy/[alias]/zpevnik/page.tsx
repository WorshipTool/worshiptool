'use client'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import SongSelectPopup from '@/common/components/SongSelectPopup/SongSelectPopup'
import SongListCards from '@/common/components/songLists/SongListCards/SongListCards'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { Add } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { SongVariantDto, VariantPackGuid } from '@/api/dtos'
import SearchFieldTeamZpevnik from '@/app/(subdomains)/sub/tymy/[alias]/zpevnik/components/SearchFieldTeamZpevnik'
import SelectedPanel from '@/app/(subdomains)/sub/tymy/[alias]/zpevnik/components/SelectedPanel'
import { TeamPermissions } from '@/app/(subdomains)/sub/tymy/tech'
import SongDropContainer from '@/hooks/dragsong/SongDropContainer'
import { DragSongDto } from '@/hooks/dragsong/tech'
import { usePermission } from '@/hooks/permissions/usePermission'
import { RoutesKeys, SmartParams, parseVariantAlias } from '@/routes'
import { LinearProgress } from '@mui/material'
import './styles.css'

export default function TeamSongsPage() {
	const { selection, guid: teamGuid, alias } = useInnerTeam()
	const items = useMemo(() => {
		const items =
			selection.searchedItems.length > 0
				? selection.searchedItems
				: selection.items
		return items.map((item) => item.variant)
	}, [selection])

	const addSongPermission = usePermission<TeamPermissions>('team.add_song', {
		teamGuid,
	})
	const [selected, setSelected] = useState<VariantPackGuid[]>([])

	const [selectable, setSelectable] = useState(false)

	const [open, setOpen] = useState(false)

	const [thereHasBeenItems, setThereHasBeenItems] = useState(false)
	useEffect(() => {
		if (selection.loading) return

		// after one second, the popup will open
		const t = setTimeout(() => {
			if (selection.items.length === 0 && thereHasBeenItems === false) {
				if (addSongPermission) setOpen(true)
			} else if (thereHasBeenItems === false) {
				setThereHasBeenItems(true)
			}
		}, 1000)

		return () => {
			clearTimeout(t)
		}
	}, [items, thereHasBeenItems, addSongPermission])

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

	const cardToProps = useCallback((variant: SongVariantDto) => {
		const p = parseVariantAlias(variant.packAlias)

		const to: RoutesKeys = 'teamSong'
		const params: SmartParams<'teamSong'> = {
			hex: p.hex,
			'title-alias': p.alias,
			alias,
		}
		return {
			to,
			params,
		}
	}, [])

	const cancelSelect = useCallback(() => {
		setSelected([])
		setSelectable(false)
	}, [])

	const onSongDrop = useCallback(
		(data: DragSongDto) => {
			if (selection.items.some((i) => i.variant.packGuid === data.packGuid))
				return
			selection.addVariant(data.packGuid)
		},
		[selection]
	)

	return (
		<>
			<TeamPageTitle>Zpěvník</TeamPageTitle>
			<SongDropContainer
				onDrop={onSongDrop}
				style={{
					height: '100%',
				}}
			>
				{/* {(over) => ( */}
				<Box display={'flex'} flexDirection={'column'} gap={3}>
					{selection.loading && (
						<>
							<LinearProgress />
						</>
					)}

					{((!selectable && items.length > 0) || selectable) && (
						<Box
							sx={{
								minHeight: '3rem',
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							{!selectable && items.length > 0 && (
								<Box
									display={'flex'}
									flexDirection={'row'}
									justifyContent={'space-between'}
									gap={1}
									flex={1}
								>
									{<SearchFieldTeamZpevnik />}
									<Box
										display={'flex'}
										flexDirection={'row'}
										justifyContent={'end'}
										gap={2}
									>
										{
											<Button
												variant="text"
												color="black"
												size="small"
												onClick={() => setSelectable(true)}
											>
												Vybrat
											</Button>
										}
										{addSongPermission && (
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
										)}
									</Box>
								</Box>
							)}
							{selectable && (
								<SelectedPanel
									onCancelSelect={cancelSelect}
									selectedPacks={selected}
								/>
							)}
						</Box>
					)}
					<SongListCards
						data={items}
						cardToLinkProps={cardToProps}
						selectable={selectable}
						onCardSelect={onCardSelect}
						onCardDeselect={onCardDeselect}
					/>
					{!selection.loading && items.length === 0 && (
						<Box gap={1} display={'flex'} flexDirection={'column'}>
							<Typography>Ve zpěvníku nejsou zatím žádné písně...</Typography>
							{addSongPermission && (
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
							)}
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
				{/* )} */}
			</SongDropContainer>
		</>
	)
}

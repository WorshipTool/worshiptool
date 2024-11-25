import { SongVariantDto, VariantPackGuid } from '@/api/dtos'
import SearchFieldTeamZpevnik from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/zpevnik/components/SearchFieldTeamZpevnik'
import SelectedPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/zpevnik/components/SelectedPanel'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import SongListCards from '@/common/components/songLists/SongListCards/SongListCards'
import SongSelectPopup from '@/common/components/SongSelectPopup/SongSelectPopup'
import { Box, Button, LinearProgress, Typography } from '@/common/ui'
import SongDropContainer from '@/hooks/dragsong/SongDropContainer'
import { DragSongDto } from '@/hooks/dragsong/tech'
import { usePermission } from '@/hooks/permissions/usePermission'
import { Add, StickyNote2 } from '@mui/icons-material'
import {
	ComponentProps,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

type Props = {
	cardToProps: ComponentProps<typeof SongListCards>['cardToLinkProps']
}

export const TeamSongList = (props: Props) => {
	const { selection, guid: teamGuid, alias, notes } = useInnerTeam()
	const [searchString, setSearchString] = useState('')
	const items = useMemo(() => {
		const items =
			searchString.length > 0 ? selection.searchedItems : selection.items
		return items.map((item) => item.variant)
	}, [selection, searchString])

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
	}, [selection.items, thereHasBeenItems, addSongPermission])

	const filterFunc = useCallback(
		(pack: VariantPackGuid) => {
			return !selection.items.some((i) => i.variant.packGuid === pack)
		},
		[selection.items]
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

	const cancelSelect = useCallback(() => {
		setSelected([])
		setSelectable(false)
	}, [])

	const onSongDrop = useCallback(
		(data: DragSongDto) => {
			if (selection.items.some((i) => i.variant.packGuid === data.packGuid))
				return
			selection.addPacks([data.packGuid])
		},
		[selection]
	)

	const getCardIcons = useCallback(
		(variant: SongVariantDto) => {
			const hasNote = notes.notes.some((n) => n.packGuid === variant.packGuid)
			return [
				...(hasNote
					? [
							{
								icon: <StickyNote2 />,
							},
					  ]
					: []),
			]
		},
		[notes.notes]
	)

	return (
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

				{((!selectable && selection.items.length > 0) || selectable) && (
					<Box
						sx={{
							minHeight: '3rem',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						{!selectable && selection.items.length > 0 && (
							<Box
								display={'flex'}
								flexDirection={'row'}
								justifyContent={'space-between'}
								gap={1}
								flex={1}
								sx={{}}
							>
								<SearchFieldTeamZpevnik onSearch={setSearchString} />
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
											display={{
												xs: 'none',
												sm: 'flex',
											}}
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
					cardToLinkProps={props.cardToProps}
					selectable={selectable}
					onCardSelect={onCardSelect}
					onCardDeselect={onCardDeselect}
					cardIcons={getCardIcons}
				/>
				{!selection.loading && selection.items.length === 0 && (
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
	)
}

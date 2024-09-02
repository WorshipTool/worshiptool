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
import { useMemo, useRef, useState } from 'react'

import { VariantPackGuid } from '@/api/dtos'
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

	const [open, setOpen] = useState(false)

	const anchorRef = useRef(null)
	const [anchorName, setAnchorName] = useState('')

	const onAdd = () => {
		setOpen(true)
	}

	const onSongAddSubmit = (packs: VariantPackGuid[]) => {
		selection.addPacks(packs)
	}

	return (
		<div>
			<TeamPageTitle>Zpěvník</TeamPageTitle>

			<Box display={'flex'} flexDirection={'column'} gap={3}>
				{items.length > 0 && (
					<Box
						display={'flex'}
						flexDirection={'row'}
						justifyContent={'space-between'}
					>
						<SearchFieldTeamZpevnik />
						<Box
							display={'flex'}
							ref={(r) => {
								anchorRef.current = r as any
								setAnchorName('addSongRight')
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

				<SongListCards data={items} />
				{items.length === 0 && (
					<Box gap={1} display={'flex'} flexDirection={'column'}>
						<Typography>Ve zpěvníku týmu nejsou žádné písně...</Typography>
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
					/>
				</Box>
			</Box>
		</div>
	)
}

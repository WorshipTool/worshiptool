'use client'

import { mapBasicVariantPackApiToDto } from '@/api/dtos/song/song.map'
import { GetListSongData } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { Box, Button, Typography } from '@/common/ui'
import { Pagination } from '@/common/ui/mui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import {
	ChevronRightRounded,
	CloudOffRounded,
	MusicNoteRounded,
	RefreshRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { Fragment, useEffect, useMemo, useState } from 'react'

const PREVIEW_LINES = 1
// divider starts past the leading icon: row padding (2u) + icon (5u) + gap (1.5u)
const DIVIDER_INSET = 8.5

// the whole page of songs lives in one white "group" surface (iOS-style
// grouped list); each row is a flattened SongVariantCard separated by a hairline
const GROUP_CARD_SX = {
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
	overflow: 'hidden',
} as const

// strip the card chrome off SongVariantCard so it reads as a row inside the group
const FLAT_ROW_SX = {
	bgcolor: 'transparent',
	borderRadius: 0,
	outlineColor: 'transparent',
	'&:hover': { bgcolor: 'grey.50', boxShadow: 'none' },
	'&:active': { bgcolor: 'grey.100' },
} as const

// small alphabetical section label above each letter's group card
const LETTER_HEADER_SX = {
	paddingLeft: 0.5,
	paddingTop: 0.5,
	paddingBottom: 0.5,
} as const

// first letter of a song title, upper-cased for the section header
const firstLetter = (title: string) =>
	(title.trim().charAt(0) || '#').toLocaleUpperCase('cs')

function SongLeadingIcon() {
	return (
		<Box
			sx={{
				width: 40,
				height: 40,
				borderRadius: 2,
				bgcolor: 'grey.100',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
			}}
		>
			<MusicNoteRounded sx={{ fontSize: 20, color: 'grey.600' }} />
		</Box>
	)
}

function Divider() {
	return (
		<Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: DIVIDER_INSET }} />
	)
}

type SeznamMobileProps = {
	/** 1-indexed page, kept in the URL by the parent (shared with desktop) */
	page: number
	onPageChange: (page: number) => void
	count: number
	/** Page size, owned by the page so mobile and desktop agree on what `?s=` means */
	perPage: number
}

/**
 * Native-feeling mobile songs list, built on the shared MobileAppHeader
 * app-shell (collapsing title, only the content scrolls, paginator pinned in a
 * quiet bottom panel — see docs/design/MOBILE.md). The songs of the current
 * page are grouped by first letter; there are thousands of songs, so paging
 * beats an endless scroll. The desktop grid stays in page.tsx.
 */
export default function SeznamMobile({
	page,
	onPageChange,
	count,
	perPage,
}: SeznamMobileProps) {
	const t = useTranslations('songsList')
	const tCommon = useTranslations('common')
	const { songGettingApi } = useApi()

	const [items, setItems] = useState<GetListSongData[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [reloadKey, setReloadKey] = useState(0)

	const pagesCount = Math.max(1, Math.ceil(count / perPage))

	// split the current page's songs into consecutive first-letter sections so
	// each new starting letter gets a header — kept entirely within the page
	// (the backend returns the list alphabetically sorted)
	const letterGroups = useMemo(() => {
		const groups: { letter: string; items: GetListSongData[] }[] = []
		for (const s of items) {
			const letter = firstLetter(s.main.title)
			const last = groups[groups.length - 1]
			if (last && last.letter === letter) last.items.push(s)
			else groups.push({ letter, items: [s] })
		}
		return groups
	}, [items])

	useEffect(() => {
		let active = true
		setLoading(true)
		setError(false)
		// `page` is 1-indexed for the UI/paginator, but the backend list is
		// 0-indexed (see Pager, which fetches `page - 1`) — so page 1 → offset 0.
		songGettingApi
			.getList(page - 1, perPage)
			.then((data) => {
				if (active) setItems(data)
			})
			.catch(() => {
				if (active) {
					setItems([])
					setError(true)
				}
			})
			.finally(() => {
				if (active) setLoading(false)
			})
		return () => {
			active = false
		}
	}, [page, perPage, songGettingApi, reloadKey])

	const paginator =
		!error && pagesCount > 1 ? (
			<Pagination
				count={pagesCount}
				page={Math.min(page, pagesCount)}
				onChange={(_, p) => onPageChange(p)}
				siblingCount={0}
				boundaryCount={1}
				sx={{
					// finger-sized touch targets (44px) while staying compact
					'& .MuiPaginationItem-root': {
						minWidth: 44,
						height: 44,
						margin: '0 2px',
						fontSize: '1rem',
					},
				}}
			/>
		) : undefined

	return (
		<MobileAppHeader
			title={t('title')}
			bottomPanel={paginator}
			scrollResetKey={page}
		>
			{loading ? (
				<Box sx={GROUP_CARD_SX}>
					{Array.from({ length: perPage }).map((_, i) => (
						<Fragment key={i}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1.5,
									paddingX: 1.75,
									paddingY: 1.25,
								}}
							>
								<Skeleton
									variant="rounded"
									sx={{
										width: 40,
										height: 40,
										borderRadius: 2,
										bgcolor: 'grey.100',
										flexShrink: 0,
									}}
								/>
								<Box sx={{ flex: 1 }}>
									<Skeleton
										variant="text"
										sx={{ width: '55%', bgcolor: 'grey.100' }}
									/>
									<Skeleton
										variant="text"
										sx={{ width: '80%', bgcolor: 'grey.100' }}
									/>
								</Box>
							</Box>
							{i < perPage - 1 && <Divider />}
						</Fragment>
					))}
				</Box>
			) : error ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						textAlign: 'center',
						gap: 2,
						paddingTop: 8,
						paddingX: 3,
					}}
				>
					<CloudOffRounded sx={{ fontSize: 48, color: 'grey.400' }} />
					<Typography color="grey.600">{t('error')}</Typography>
					<Button
						variant="outlined"
						onClick={() => setReloadKey((k) => k + 1)}
						startIcon={<RefreshRounded />}
						disableUppercase
					>
						{tCommon('tryAgain')}
					</Button>
				</Box>
			) : items.length === 0 ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						textAlign: 'center',
						gap: 1,
						paddingTop: 8,
						paddingX: 3,
					}}
				>
					<MusicNoteRounded sx={{ fontSize: 48, color: 'grey.400' }} />
					<Typography color="grey.600">{t('empty')}</Typography>
				</Box>
			) : (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
					{letterGroups.map((group, groupIndex) => (
						// groups are consecutive runs, so the same letter can appear twice
						// (mixed collation, or two untitled songs both mapping to '#')
						<Box key={`${group.letter}-${groupIndex}`}>
							<Box sx={LETTER_HEADER_SX}>
								<Typography
									small
									strong={700}
									color="grey.700"
									sx={{ letterSpacing: '0.5px' }}
								>
									{group.letter}
								</Typography>
							</Box>
							<Box sx={GROUP_CARD_SX}>
								{group.items.map((s, i) => (
									<Fragment key={`${String(s.main.packGuid)}-${i}`}>
										<SongVariantCard
											data={mapBasicVariantPackApiToDto(s.main)}
											dense
											previewLines={PREVIEW_LINES}
											leadingIcon={<SongLeadingIcon />}
											trailingIcon={
												<ChevronRightRounded sx={{ color: 'grey.400' }} />
											}
											sx={FLAT_ROW_SX}
										/>
										{i < group.items.length - 1 && <Divider />}
									</Fragment>
								))}
							</Box>
						</Box>
					))}
				</Box>
			)}
		</MobileAppHeader>
	)
}

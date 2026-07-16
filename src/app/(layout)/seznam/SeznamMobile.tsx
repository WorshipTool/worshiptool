'use client'

import { mapBasicVariantPackApiToDto } from '@/api/dtos/song/song.map'
import { GetListSongData } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { Box, CircularProgress, Typography } from '@/common/ui'
import { Pagination } from '@/common/ui/mui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const PAGE_MAX_WIDTH = 480
const PER_PAGE = 12
// on app-shell routes the top bar's sticky spacer shrinks to the safe-area
// inset (Toolbar.tsx); reclaim exactly that so the grey canvas reaches the top
const TOOLBAR_SPACER = 'env(safe-area-inset-top)'
const CONTENT_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 96px)'
const PREVIEW_LINES = 2

const CARD_SX = {
	bgcolor: 'background.paper',
	boxShadow: 1,
	'&:hover': { bgcolor: 'background.paper' },
}

type SeznamMobileProps = {
	/** 1-indexed page, kept in the URL by the parent (shared with desktop) */
	page: number
	onPageChange: (page: number) => void
	count: number
}

/**
 * Native-feeling mobile songs list: white song cards floating on the grey
 * canvas (matching the home screen), but paginated — there are thousands of
 * songs, so paging beats an endless scroll. The desktop grid stays in
 * page.tsx; this component owns the phone view.
 */
export default function SeznamMobile({
	page,
	onPageChange,
	count,
}: SeznamMobileProps) {
	const t = useTranslations('songsList')
	const { songGettingApi } = useApi()

	const [items, setItems] = useState<GetListSongData[]>([])
	const [loading, setLoading] = useState(true)

	const pagesCount = Math.max(1, Math.ceil(count / PER_PAGE))

	useEffect(() => {
		let active = true
		setLoading(true)
		songGettingApi
			.getList(page, PER_PAGE)
			.then((data) => {
				if (active) setItems(data)
			})
			.catch(() => {
				if (active) setItems([])
			})
			.finally(() => {
				if (active) setLoading(false)
			})
		return () => {
			active = false
		}
	}, [page, songGettingApi])

	const goToPage = (p: number) => {
		onPageChange(p)
		if (typeof window !== 'undefined')
			window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<Box
			sx={{
				// full-bleed: escape the SmartPage padded wrapper and the toolbar spacer
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				marginTop: `calc(-1 * ${TOOLBAR_SPACER})`,
				minHeight: '100dvh',
				bgcolor: 'grey.300',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: PAGE_MAX_WIDTH,
					minWidth: 0,
					minHeight: '100dvh',
					bgcolor: 'grey.100',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
				}}
			>
				<Box
					sx={{
						paddingX: 2.5,
						paddingTop: 'calc(env(safe-area-inset-top) + 24px)',
						paddingBottom: 1.5,
					}}
				>
					<Typography variant="h4" strong={800}>
						{t('title')}
					</Typography>
				</Box>

				<Box
					sx={{
						paddingX: 2.5,
						paddingTop: 1,
						paddingBottom: CONTENT_CLEARANCE,
						display: 'flex',
						flexDirection: 'column',
						gap: 2.5,
					}}
				>
					<Box
						sx={{
							position: 'relative',
							display: 'flex',
							flexDirection: 'column',
							gap: 1,
							minHeight: 320,
						}}
					>
						{loading && items.length === 0
							? Array.from({ length: PER_PAGE }).map((_, i) => (
									<Skeleton
										key={i}
										variant="rounded"
										sx={{ height: 72, borderRadius: 2, bgcolor: 'grey.200' }}
									/>
							  ))
							: items.map((s, i) => (
									<SongVariantCard
										key={`${String(s.main.packGuid)}-${i}`}
										data={mapBasicVariantPackApiToDto(s.main)}
										dense
										previewLines={PREVIEW_LINES}
										sx={CARD_SX}
									/>
							  ))}

						{loading && items.length > 0 && (
							<Box
								sx={{
									position: 'absolute',
									inset: 0,
									display: 'flex',
									alignItems: 'flex-start',
									justifyContent: 'center',
									paddingTop: 6,
									bgcolor: 'grey.100',
									opacity: 0.6,
									borderRadius: 2,
								}}
							>
								<CircularProgress />
							</Box>
						)}
					</Box>

					{pagesCount > 1 && (
						<Box sx={{ display: 'flex', justifyContent: 'center' }}>
							<Pagination
								count={pagesCount}
								page={page}
								onChange={(_, p) => goToPage(p)}
								color="primary"
								siblingCount={0}
								boundaryCount={1}
							/>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	)
}

'use client'

import { mapBasicVariantPackApiToDto } from '@/api/dtos/song/song.map'
import { GetListSongData } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { Box, Typography } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { useIsInViewport } from '@/hooks/useIsInViewport'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const PAGE_MAX_WIDTH = 480
const PER_PAGE = 20
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

/**
 * Native-feeling mobile songs list: white song cards floating on the grey
 * canvas (matching the home screen) with infinite scroll instead of the
 * desktop paginated grid. The desktop grid stays in page.tsx; this component
 * owns the phone view.
 */
export default function SeznamMobile() {
	const t = useTranslations('songsList')
	const { songGettingApi } = useApi()

	const [items, setItems] = useState<GetListSongData[]>([])
	const [initialLoading, setInitialLoading] = useState(true)
	const [hasMore, setHasMore] = useState(true)

	const loadingRef = useRef(false)
	const hasMoreRef = useRef(true)
	const loadedPagesRef = useRef(0)
	const seenRef = useRef<Set<string>>(new Set())
	const sentinelRef = useRef<HTMLDivElement>(null)

	const loadMore = useCallback(async () => {
		if (loadingRef.current || !hasMoreRef.current) return
		loadingRef.current = true
		try {
			// getList is 1-indexed; each call returns the next server page
			const nextPage = loadedPagesRef.current + 1
			const data = await songGettingApi.getList(nextPage, PER_PAGE)
			loadedPagesRef.current = nextPage
			if (data.length < PER_PAGE) {
				hasMoreRef.current = false
				setHasMore(false)
			}
			// the backend overlaps one item at each page boundary, so drop packs
			// we've already shown to avoid duplicate cards
			const fresh = data.filter((s) => {
				const guid = String(s.main.packGuid)
				if (seenRef.current.has(guid)) return false
				seenRef.current.add(guid)
				return true
			})
			if (fresh.length) setItems((prev) => prev.concat(fresh))
		} catch {
			// keep whatever is already loaded; a later scroll can retry
		} finally {
			setInitialLoading(false)
			loadingRef.current = false
		}
	}, [songGettingApi])

	useEffect(() => {
		loadMore()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useIsInViewport(sentinelRef, '400px', (intersecting) => {
		if (intersecting && !initialLoading) loadMore()
	})

	const cards = useMemo(
		() =>
			items.map((s) => ({
				key: String(s.main.packGuid),
				pack: mapBasicVariantPackApiToDto(s.main),
			})),
		[items]
	)

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
						gap: 1,
					}}
				>
					{initialLoading
						? Array.from({ length: 8 }).map((_, i) => (
								<Skeleton
									key={i}
									variant="rounded"
									sx={{ height: 72, borderRadius: 2, bgcolor: 'grey.200' }}
								/>
						  ))
						: cards.map((c) => (
								<SongVariantCard
									key={c.key}
									data={c.pack}
									dense
									previewLines={PREVIEW_LINES}
									sx={CARD_SX}
								/>
						  ))}

					{!initialLoading &&
						hasMore &&
						Array.from({ length: 3 }).map((_, i) => (
							<Skeleton
								key={`more-${i}`}
								variant="rounded"
								sx={{ height: 72, borderRadius: 2, bgcolor: 'grey.200' }}
							/>
						))}

					<Box ref={sentinelRef} sx={{ height: 1 }} />
				</Box>
			</Box>
		</Box>
	)
}

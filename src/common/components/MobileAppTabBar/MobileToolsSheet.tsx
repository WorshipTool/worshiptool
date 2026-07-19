'use client'

import Popup from '@/common/components/Popup/Popup'
import useToolsMenuItems from '@/common/components/Toolbar/components/RightAccountPanel/Toolsmenu/hooks/useToolsMenuItems'
import { Box, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { AppsRounded, ChevronRightRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

/**
 * Mobile "Nástroje" sheet — the phone counterpart of the desktop Apps/tools
 * menu. Opened from the bottom tab bar; lists the same shortcuts (playlists,
 * my songs, favourites, teams…) as tappable rows and closes on navigation.
 */
export default function MobileToolsSheet({ onClose }: { onClose: () => void }) {
	const tNav = useTranslations('navigation')
	const { items } = useToolsMenuItems()

	const visible = items.filter((i) => !i.hidden)

	const rowInner = (title: string, image: string) => (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1.5,
				paddingX: 1,
				paddingY: 1.25,
				borderRadius: 2,
				transition: 'background-color 0.15s ease',
				'&:active': { bgcolor: 'grey.100' },
			}}
		>
			<Box
				sx={{
					width: 36,
					height: 36,
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Box
					component="img"
					src={image}
					alt=""
					sx={{ width: 30, height: 30, objectFit: 'contain' }}
				/>
			</Box>
			<Typography strong noWrap sx={{ flex: 1, minWidth: 0 }}>
				{title}
			</Typography>
			<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
		</Box>
	)

	return (
		<Popup
			open
			onClose={onClose}
			width={360}
			icon={<AppsRounded sx={{ color: 'primary.main' }} />}
			title={tNav('tools')}
		>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				{visible.map((item, i) => {
					const content: ReactNode = rowInner(item.title, item.image)
					if (item.to) {
						return (
							<Link
								key={`${item.title}-${i}`}
								to={item.to as any}
								params={(item.toParams ?? {}) as any}
								onClick={() => {
									item.action?.()
									if (!item.disabled) onClose()
								}}
							>
								{content}
							</Link>
						)
					}
					return (
						<Box
							key={`${item.title}-${i}`}
							onClick={() => {
								item.action?.()
								if (!item.disabled) onClose()
							}}
							sx={{ cursor: 'pointer' }}
						>
							{content}
						</Box>
					)
				})}
			</Box>
		</Popup>
	)
}

'use client'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Card, useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'
import { Info } from '@mui/icons-material'

export default function CannotEditOnPhone() {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))

	const { canUserEdit } = useInnerPlaylist()
	const show = isMobile && canUserEdit

	return (
		show && (
			<Card
				icon={<Info />}
				subtitle="Playlist nelze na malém zařízení editovat. Pro editaci použij prosím
                        počítač."
				sx={{
					marginBottom: 2,
				}}
			></Card>
		)
	)
}

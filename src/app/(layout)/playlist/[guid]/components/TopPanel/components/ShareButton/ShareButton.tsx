import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import SmartPortalMenuItem from '@/common/components/SmartPortalMenuItem/SmartPortalMenuItem'
import { useDownSize } from '@/common/hooks/useDownSize'
import { Button } from '@/common/ui/Button'
import { getRouteUrlWithParams } from '@/routes/routes.tech'
import { Share } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useMemo } from 'react'

export default function ShareButton() {
	const { guid, title, save } = useInnerPlaylist()
	const url = useMemo(() => getRouteUrlWithParams('playlist', { guid }), [guid])

	const { enqueueSnackbar } = useSnackbar()

	const isSmall = useDownSize('md')

	const onShare = async () => {
		await save()
		if (navigator.share) {
			navigator
				.share({
					title: title + ' - Playlist',
					url: url,
				})
				.then(() => {})
				.catch(console.error)
		}
		navigator.clipboard.writeText(url)

		enqueueSnackbar('Odkaz zkopírován do schránky', {})
	}

	return isSmall ? (
		<>
			<SmartPortalMenuItem
				title={'Sdílet'}
				icon={<Share />}
				onClick={onShare}
			/>
		</>
	) : (
		<Button
			endIcon={<Share />}
			color="secondary"
			size={'small'}
			onClick={onShare}
		>
			Sdílet
		</Button>
	)
}

import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { openNewPrintWindow } from '@/app/(nolayout)/(print)/print.tech'
import { Button } from '@/common/ui/Button'
import { SmartAllParams, getReplacedUrlWithParams, routesPaths } from '@/routes'
import { Print } from '@mui/icons-material'

export default function PrintButton() {
	const { guid, save } = useInnerPlaylist()

	const onPrint = async () => {
		await save()

		const urlPattern = routesPaths.playlistPrint
		const printParams: SmartAllParams<'playlistPrint'> = {
			guid,
		}
		const url = getReplacedUrlWithParams(urlPattern, printParams)

		openNewPrintWindow(url)
	}
	return (
		<Button startIcon={<Print />} size="small" onClick={onPrint}>
			Tiskout
		</Button>
	)
}

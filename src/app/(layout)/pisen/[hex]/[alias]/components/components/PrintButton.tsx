import { openNewPrintWindow } from '@/app/(nolayout)/(print)/print.tech'
import { Print } from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { note } from '@pepavlin/sheet-api'
import { Button } from '../../../../../../../common/ui/Button'
import { IconButton } from '../../../../../../../common/ui/IconButton'
import {
	getReplacedUrlWithParams,
	routesPaths,
	SmartAllParams,
} from '../../../../../../../routes'
import { useSmartNavigate } from '../../../../../../../routes/useSmartNavigate'
import { useSmartParams } from '../../../../../../../routes/useSmartParams'

interface PrintButtonProps {
	keyNote: note | null
	hideChords: boolean | null
}

export default function PrintButton(props: PrintButtonProps) {
	const navigate = useSmartNavigate()
	const params = useSmartParams('variant')
	const onPrintClick = () => {
		// open new window on url
		const urlPattern = routesPaths.variantPrint
		const printParams: SmartAllParams<'variantPrint'> = {
			...params,
			key: props.keyNote || undefined,
			hideChords: props.hideChords ? 'true' : 'false' || undefined,
		}
		const url = getReplacedUrlWithParams(urlPattern, printParams)

		openNewPrintWindow(url)
	}
	const theme = useTheme()
	return (
		<div>
			<Button
				endIcon={<Print />}
				variant="outlined"
				color="primary"
				onClick={onPrintClick}
				tooltip="Tisknout"
				sx={{
					[theme.breakpoints.down('lg')]: {
						display: 'none',
					},
				}}
			>
				Tisknout
			</Button>
			<IconButton
				onClick={onPrintClick}
				tooltip="Tisknout"
				sx={{
					[theme.breakpoints.up('lg')]: {
						display: 'none',
					},
				}}
			>
				<Print />
			</IconButton>
		</div>
	)
}

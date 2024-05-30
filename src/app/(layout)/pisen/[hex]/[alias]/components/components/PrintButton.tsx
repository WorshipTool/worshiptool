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
}

export default function PrintButton(props: PrintButtonProps) {
	const navigate = useSmartNavigate()
	const params = useSmartParams('variant')
	const onPrintClick = () => {
		// window.print()
		// navigate('variantPrint', params)
		// open new window on url
		const urlPattern = routesPaths.variantPrint
		const printParams: SmartAllParams<'variantPrint'> = {
			...params,
			key: props.keyNote || undefined,
		}
		const url = getReplacedUrlWithParams(urlPattern, printParams)

		const width = 800
		const height = 600
		const left = (window.screen.width - width) / 2
		const top = (window.screen.height - height) / 4

		window.open(
			url,
			'_blank',
			`width=${width},height=${height},left=${left},top=${top}`
		)
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

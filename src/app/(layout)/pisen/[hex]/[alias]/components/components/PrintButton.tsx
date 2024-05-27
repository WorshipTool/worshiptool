import { Print } from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { Button } from '../../../../../../../common/ui/Button'
import { IconButton } from '../../../../../../../common/ui/IconButton'
import {
	getReplacedUrlWithParams,
	routesPaths,
	SmartParams,
} from '../../../../../../../routes'
import { useSmartNavigate } from '../../../../../../../routes/useSmartNavigate'
import { useSmartParams } from '../../../../../../../routes/useSmartParams'

interface PrintButtonProps {}

export default function PrintButton(props: PrintButtonProps) {
	const navigate = useSmartNavigate()
	const params = useSmartParams('variant')
	const onPrintClick = () => {
		// window.print()
		// navigate('variantPrint', params)
		// open new window on url
		const urlPattern = routesPaths.variantPrint
		const printParams: SmartParams<'variantPrint'> = params
		const url = getReplacedUrlWithParams(urlPattern, printParams)
		window.open(url, '_blank', 'width=800,height=600')
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

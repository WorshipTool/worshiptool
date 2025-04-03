import { openNewPrintWindow } from '@/app/(nolayout)/(print)/print.tech'
import { useTheme } from '@/common/ui'
import { getReplacedUrlWithParams } from '@/routes/tech/transformer.tech'
import { Print } from '@mui/icons-material'
import { Button } from '../../../../../../../common/ui/Button'
import { IconButton } from '../../../../../../../common/ui/IconButton'
import { routesPaths, SmartAllParams } from '../../../../../../../routes'

type PrintVariantButtonProps = {
	params: SmartAllParams<'variantPrint'>
} & React.ComponentProps<typeof Button>

export default function PrintVariantButton(props: PrintVariantButtonProps) {
	const onPrintClick = () => {
		// open new window on url
		const url = getReplacedUrlWithParams(
			routesPaths['variantPrint'],
			props.params,
			{
				returnFormat: 'absolute',
			}
		)

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
				{...props}
				sx={{
					[theme.breakpoints.down('md')]: {
						display: 'none',
					},
					...props.sx,
				}}
			>
				Tisknout
			</Button>
			<IconButton
				onClick={onPrintClick}
				tooltip="Tisknout"
				sx={{
					[theme.breakpoints.up('md')]: {
						display: 'none',
					},
				}}
				size="small"
			>
				<Print />
			</IconButton>
		</div>
	)
}

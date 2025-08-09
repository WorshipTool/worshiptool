import { useTheme } from '@/common/ui'
import { Slideshow } from '@mui/icons-material'
import { Button } from '../../../../../../../common/ui/Button'
import { IconButton } from '../../../../../../../common/ui/IconButton'

type PresentationVariantButtonProps = {
	params: { hex: string; alias: string }
} & React.ComponentProps<typeof Button>

export default function PresentationVariantButton(props: PresentationVariantButtonProps) {
	const onPresentationClick = () => {
		// Build URL manually since type system hasn't been regenerated yet
		const url = `/pisen/${props.params.hex}/${props.params.alias}/prezentace`
		window.open(url, '_blank')
	}
	const theme = useTheme()
	return (
		<div>
			<Button
				endIcon={<Slideshow />}
				variant="outlined"
				color="primary"
				onClick={onPresentationClick}
				tooltip="Prezentace"
				{...props}
				sx={{
					[theme.breakpoints.down('md')]: {
						display: 'none',
					},
					...props.sx,
				}}
			>
				Prezentace
			</Button>
			<IconButton
				onClick={onPresentationClick}
				tooltip="Prezentace"
				sx={{
					[theme.breakpoints.up('md')]: {
						display: 'none',
					},
				}}
				size="small"
			>
				<Slideshow />
			</IconButton>
		</div>
	)
}
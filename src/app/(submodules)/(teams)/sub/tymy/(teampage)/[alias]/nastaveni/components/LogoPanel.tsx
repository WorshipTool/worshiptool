import { Box, CircularProgress } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Image } from '@/common/ui/Image'
import { grey } from '@/common/ui/mui/colors'

type LogoPanelProps = {
	editable: boolean
	onChange?: (file: File | null) => Promise<void>
	imageUrl: string
	loading: boolean
}

const LOGO_PANEL_INPUT_ID = 'logo-panel-input'

export default function LogoPanel(props: LogoPanelProps) {
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			// setChosenFile(e.target.files[0])
			props.onChange?.(e.target.files[0])
		}
	}

	const selectFile = () => {
		const input = document.getElementById(
			LOGO_PANEL_INPUT_ID
		) as HTMLInputElement
		input?.click()
	}

	return (
		<Box>
			<Box
				sx={{
					width: props.editable ? 200 : 100,
					aspectRatio: 1,
					borderWidth: 2,
					borderStyle: 'solid',
					position: 'relative',
				}}
				borderColor={grey[300]}
				borderRadius={2}
			>
				<Box margin={1}>
					{props.loading ? (
						<CircularProgress />
					) : (
						<Image
							alt="logo"
							src={props.imageUrl}
							style={{
								width: '100%',
								objectFit: 'contain',
								pointerEvents: 'none',
								userSelect: 'none',
								aspectRatio: 1,
							}}
						/>
					)}
				</Box>

				{props.editable && (
					<Box
						sx={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
						}}
					>
						<input
							accept="image/*"
							id={LOGO_PANEL_INPUT_ID}
							// multiple
							type="file"
							onChange={onFileChange}
							style={{ display: 'none' }}
						/>
						<Button
							variant="contained"
							color="secondary"
							onClick={selectFile}
							size="small"
							sx={{}}
						>
							Změnit logo
						</Button>
					</Box>
				)}
			</Box>
		</Box>
	)
}

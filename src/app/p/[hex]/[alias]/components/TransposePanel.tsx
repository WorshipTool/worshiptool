import { Add, Remove } from '@mui/icons-material'
import { Box, Typography, alpha, styled } from '@mui/material'
import { Gap } from '../../../../../common/ui/Gap'
import { IconButton } from '../../../../../common/ui/IconButton'

const StyledButton = styled(IconButton)(({ theme }) => ({
	color: 'black',
}))

const Container = styled(Box)(({ theme }) => ({
	borderRadius: 8,
	padding: 2,
	paddingLeft: 10,
	boxShadow: `0px 0px 6px ${alpha(theme.palette.grey[400], 0.8)}`,
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
}))

export default function TransposePanel({
	transpose,
	disabled = true,
}: {
	transpose: (i: number) => void
	disabled?: boolean
}) {
	return (
		<Container>
			{/* {disabled ? (
                <>
                    <Button disabled>Píseň nemá akordy</Button>
                </>
            ) : ( */}
			<>
				<Typography
					variant="subtitle2"
					fontWeight={'400'}
					sx={{
						color: disabled ? 'lightgrey' : 'black',
					}}
				>
					TRANSPOZICE
				</Typography>
				<Gap horizontal value={0.5} />
				<StyledButton
					disabled={disabled}
					onClick={() => {
						transpose(1)
					}}
					size="small"
					tooltip="Zvýšit o půltón"
				>
					<Add />
				</StyledButton>
				<StyledButton
					disabled={disabled}
					onClick={() => {
						transpose(-1)
					}}
					size="small"
					tooltip="Snížit o půltón"
				>
					<Remove />
				</StyledButton>
			</>
			{/* )} */}
		</Container>
	)
}

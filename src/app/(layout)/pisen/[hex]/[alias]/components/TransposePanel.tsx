'use client'

import { Box, Typography } from '@/common/ui'
import { styled } from '@/common/ui/mui'
import { Add, Remove } from '@mui/icons-material'
import { Gap } from '../../../../../../common/ui/Gap'
import { IconButton } from '../../../../../../common/ui/IconButton'
import { useTranslations } from 'next-intl'

const StyledButton = styled(IconButton)(({ theme }) => ({
	color: theme.palette.text.primary,
}))

const Container = styled(Box)(({ theme }) => ({
	borderRadius: 8,
	padding: 2,
	paddingLeft: 10,
	backgroundColor: theme.palette.background.paper,
	border: `1px solid ${theme.palette.grey[300]}`,
	boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
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
	const tTranspose = useTranslations('songPage.transpose')
	return (
		<Container>
			{/* {disabled ? (
                <>
                    <Button disabled>Píseň nemá akordy</Button>
                </>
            ) : ( */}
			<>
				<Typography
					strong={500}
					sx={{
						color: disabled ? 'text.disabled' : 'text.secondary',
					}}
					size={'small'}
					uppercase
				>
					{tTranspose('title')}
				</Typography>
				<Gap horizontal value={0.5} />
				<StyledButton
					disabled={disabled}
					onClick={() => {
						transpose(1)
					}}
					size="small"
					tooltip={tTranspose('increase')}
				>
					<Add />
				</StyledButton>
				<StyledButton
					disabled={disabled}
					onClick={() => {
						transpose(-1)
					}}
					size="small"
					tooltip={tTranspose('decrease')}
				>
					<Remove />
				</StyledButton>
			</>
			{/* )} */}
		</Container>
	)
}

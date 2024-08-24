import { Close } from '@mui/icons-material'
import { Box, Typography, useTheme } from '@mui/material'
import useGroup from '../../../../hooks/group/useGroup'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import { Button } from '../../../ui/Button'
import { Clickable } from '../../../ui/Clickable'
import { Toolbar } from '../Toolbar'

type GroupToolbarMobileProps = {
	expanded?: boolean
}

export default function GroupToolbarMobile(props: GroupToolbarMobileProps) {
	const theme = useTheme()
	const { isOn, code, name, turnOff } = useGroup()
	const navigate = useSmartNavigate()
	const goHome = () => {
		if (isOn) navigate('group', { groupCode: code })
		else
			navigate('home', {
				search: undefined,
			})
		window?.scroll({
			top: 0,
			behavior: 'auto',
		})
	}

	return (
		<>
			<Box height={112} />
			<Box
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
				}}
				zIndex={1}
			>
				<Toolbar />
				<Box
					sx={{
						// background: '#2f2f2f',
						background: `linear-gradient(240deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
						overflow: 'hidden',
						height: 112,
						transition: 'height 0.2s ease',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						userSelect: 'none',
						pointerEvents: 'none',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'end',
					}}
				>
					<Box
						sx={{
							paddingLeft: 4,
							paddingBottom: 2,
						}}
						display={'flex'}
						flexDirection={'row'}
						color={'white'}
					>
						<Clickable onClick={goHome}>
							<Typography
								variant="h5"
								fontWeight={900}
								sx={{
									transition: 'all 0.2s ease',
									fontSize: 24,
								}}
							>
								{name}
							</Typography>
						</Clickable>
						<Box
							flex={1}
							sx={{
								pointerEvents: 'auto',
							}}
							display={'flex'}
							marginRight={3}
						>
							<Box flex={1} />
							<Button
								variant="text"
								color="white"
								size="small"
								onClick={() => turnOff()}
								endIcon={<Close />}
							>{`Opustit mód`}</Button>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	)
}

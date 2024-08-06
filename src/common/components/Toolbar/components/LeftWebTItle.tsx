import SvgIcon from '@/assets/icon.svg'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { Box, Typography, styled } from '@mui/material'
import useGroup from '../../../../hooks/group/useGroup'
import { Link } from '../../../ui/Link/CustomLink'

const Container = styled(Box)(({ theme }) => ({
	height: '100%',
	alignItems: 'center',
	justifyContent: 'start',
	gap: theme.spacing(1),
	paddingLeft: theme.spacing(3),
	transition: 'all 0.2s ease',
	'&:hover': {
		filter: 'drop-shadow(4px 4px 4px #00000022)',
		transform: 'scale(102%)',
	},
	'&:active': {
		transform: 'scale(98%)',
	},
	cursor: 'default',
	userSelect: 'none',
	pointerEvents: 'auto',
}))
interface LeftWebTitleProps {}
export default function LeftWebTitle({}: LeftWebTitleProps) {
	const { showTitle } = useToolbar()

	const size = 36

	const { isOn, code } = useGroup()
	const goHomeClick = () => {
		window?.scroll({
			top: 0,
			behavior: 'smooth',
		})
	}
	return (
		<Link
			to={isOn ? 'group' : 'home'}
			params={
				isOn
					? {
							groupCode: code,
					  }
					: {}
			}
		>
			<Container onClick={goHomeClick} display={'flex'}>
				<SvgIcon fill="white" height={size} />
				<Typography
					fontWeight={800}
					fontSize={18}
					marginLeft={0}
					sx={{
						opacity: !showTitle ? 0 : 1,
						transition: 'opacity 0.2s ease',
					}}
				>
					Chvalotce
				</Typography>
			</Container>
		</Link>
	)
}

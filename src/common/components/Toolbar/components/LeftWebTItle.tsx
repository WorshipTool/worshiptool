import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { Box, styled } from '@mui/material'
import useGroup from '../../../../hooks/group/useGroup'
import { Link } from '../../../ui/Link/Link'
import LogoTitle from './LogoTitle'

const Container = styled(Box)(({ theme }) => ({
	height: '100%',
	alignItems: 'center',
	justifyContent: 'start',
	gap: theme.spacing(1),
	paddingLeft: theme.spacing(3),
	transition: 'all 0.2s ease',
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
				<LogoTitle hideTitle={!showTitle} />
			</Container>
		</Link>
	)
}

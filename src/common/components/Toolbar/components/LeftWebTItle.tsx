import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { Box } from '@/common/ui'
import { styled } from '@/common/ui/mui'
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
	display: 'flex',
}))
interface LeftWebTitleProps {}
export default function LeftWebTitle({}: LeftWebTitleProps) {
	const { showTitle } = useToolbar()

	return (
		<Container>
			<LogoTitle hideTitle={!showTitle} />
		</Container>
	)
}

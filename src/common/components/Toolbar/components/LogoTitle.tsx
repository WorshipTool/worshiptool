import { RESET_HOME_SCREEN_EVENT_NAME } from '@/app/components/HomeDesktop'
import SvgIcon from '@/assets/icon.svg'
import { Box, Typography } from '@/common/ui'
import { Clickable } from '@/common/ui/Clickable'
import { Link } from '@/common/ui/Link/Link'
type LogoTitleProps = {
	hideTitle?: boolean
	nonInteractive?: boolean
}

export default function LogoTitle({ hideTitle = false }: LogoTitleProps) {
	const size = 36

	const onClick = () => {
		window?.scroll({
			top: 0,
			behavior: 'smooth',
		})
		window.dispatchEvent(new Event(RESET_HOME_SCREEN_EVENT_NAME))
	}
	return (
		<Link
			to="home"
			params={{
				hledat: undefined,
			}}
		>
			<Clickable onClick={onClick}>
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={1}
				>
					<SvgIcon fill="white" height={size} />
					<Typography
						strong={800}
						size={18}
						sx={{
							marginLeft: 0,
							opacity: hideTitle ? 0 : 1,
							transition: 'opacity 0.2s ease',
						}}
					>
						Chvalotce
					</Typography>
				</Box>
			</Clickable>
		</Link>
	)
}

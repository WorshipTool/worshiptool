import SvgIcon from '@/assets/icon.svg'
import { Clickable } from '@/common/ui/Clickable'
import { Link } from '@/common/ui/Link/CustomLink'
import { Box, Typography } from '@mui/material'
type LogoTitleProps = {
	hideTitle?: boolean
	nonInteractive?: boolean
}

export default function LogoTitle({ hideTitle = false }: LogoTitleProps) {
	const size = 36
	return (
		<Link to="home" params={{}}>
			<Clickable>
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={1}
				>
					<SvgIcon fill="white" height={size} />
					<Typography
						fontWeight={800}
						fontSize={18}
						marginLeft={0}
						sx={{
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

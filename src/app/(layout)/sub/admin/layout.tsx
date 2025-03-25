import { LayoutProps } from '@/common/types'
import { Box } from '@/common/ui'
import { getServerUser } from '@/tech/auth/getServerUser'
import { forbidden } from '@/tech/error/error.tech'

export default function Layout(props: LayoutProps<'admin'>) {
	const user = getServerUser()
	if (!user) forbidden()
	// throw forbidden exception with status code 403

	return (
		<>
			<Box
				sx={{
					bgcolor: 'grey.300',
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: -1,
				}}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
				}}
			>
				<Box
					sx={{
						height: 'calc(100vh - 56px)',
						width: 300,
						bgcolor: 'grey.800',
						position: 'sticky',
						top: 56,
					}}
				/>
				<Box
					sx={{
						padding: 2,
					}}
				>
					{props.children}
				</Box>
			</Box>
		</>
	)
}

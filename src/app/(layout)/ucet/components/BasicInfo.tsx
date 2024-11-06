import { Box, Typography } from '@/common/ui'
import { Card } from '@/common/ui/Card'
import { TextField } from '@/common/ui/mui'
import Image from 'next/image'
import { Gap } from '../../../../common/ui/Gap/Gap'
import useAuth from '../../../../hooks/auth/useAuth'
import { ROLES } from '../../../../interfaces/user'

export default function BasicInfo() {
	const { info } = useAuth()
	return (
		<>
			<Card>
				<Box display={'flex'} flexDirection={'row'}>
					<Image
						src={info.pictureUrl || '/assets/account.webp'}
						alt="account"
						width={70}
						height={70}
						style={{ opacity: info.pictureUrl ? 1 : 0.3 }}
					/>
					<Box
						marginLeft={3}
						display={'flex'}
						flexDirection={'column'}
						justifyContent={'center'}
					>
						<Typography variant="h6">
							{info.firstName} {info.lastName}
						</Typography>
						<Typography>
							{info.role === ROLES.Admin
								? 'Admin'
								: info.role === ROLES.Trustee
								? 'Trustee'
								: info.role === ROLES.User
								? 'Uživatel'
								: ROLES[info.role]}
						</Typography>
					</Box>
				</Box>

				<Gap value={3} />

				<Box display={'flex'} flexDirection={'row'} gap={3}>
					<Box>
						<Typography>Křestní jméno</Typography>
						<TextField size="small" fullWidth value={info.firstName} disabled />
					</Box>
					<Box>
						<Typography>Příjmení</Typography>
						<TextField size="small" fullWidth value={info.lastName} disabled />
					</Box>
				</Box>

				<Gap />

				<Typography>Email</Typography>
				<TextField size="small" fullWidth value={info.email} disabled />
			</Card>
		</>
	)
}

import { Box, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import Card from '../../../common/ui/Card/Card'
import { Gap } from '../../../common/ui/Gap/Gap'
import useAuth from '../../../hooks/auth/useAuth'
import { ROLES } from '../../../interfaces/user'

export default function BasicInfo() {
	const { info } = useAuth()
	return (
		<Card>
			<Box display={'flex'} flexDirection={'row'}>
				<Image
					src={'/assets/account.webp'}
					alt="account"
					width={70}
					height={70}
					style={{ opacity: 0.3 }}
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
					<Typography variant="subtitle2">Křestní jméno</Typography>
					<TextField size="small" fullWidth value={info.firstName} disabled />
				</Box>
				<Box>
					<Typography variant="subtitle2">Příjmení</Typography>
					<TextField size="small" fullWidth value={info.lastName} disabled />
				</Box>
			</Box>

			<Gap />

			<Typography variant="subtitle2">Email</Typography>
			<TextField size="small" fullWidth value={info.email} disabled />

			<Gap value={3} />
			<Typography variant="caption">
				Informace uživatele zatím nelze změnit.
			</Typography>
			<Typography variant="caption">
				Na této funkcionalitě se zatím stále pracuje...
			</Typography>
		</Card>
	)
}

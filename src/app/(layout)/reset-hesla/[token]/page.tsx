'use client'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card/Card'
import { TextField } from '@/common/ui/TextField/TextField'
import { Typography } from '@/common/ui/Typography'
import useAuth from '@/hooks/auth/useAuth'
import { routesPaths } from '@/routes'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useSmartParams } from '@/routes/useSmartParams'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import '../styles.css'

export default SmartPage(Page)

function Page() {
	const [newPassword, setNewPassword] = useState('')
	const [newPasswordAgain, setNewPasswordAgain] = useState('')

	const [error, setError] = useState('')

	const { resetPassword } = useAuth()

	const navigate = useSmartNavigate()

	const { enqueueSnackbar } = useSnackbar()

	const { token } = useSmartParams('resetPasswordToken')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (newPassword === '' || newPasswordAgain === '') {
			setError('Všechna pole musí být vyplněna.')
			return
		}

		if (newPassword !== newPasswordAgain) {
			setError('Nová hesla se neshodují.')
			return
		}

		try {
			await resetPassword(token, newPassword)

			enqueueSnackbar('Heslo bylo úspěšně změněno.', { variant: 'success' })
			reset()
			navigate('login', {
				message: 'Heslo bylo úspěšně nastaveno. Nyní se můžete přihlásit.',
				previousPage: routesPaths.account,
			})
		} catch (e) {
			setError('Tento link je neplatný.')
		}
	}

	const reset = () => {
		setNewPassword('')
		setNewPasswordAgain('')
		setError('')
	}

	return (
		<Box
			sx={{
				marginTop: 3,
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Card
				title="Resetování hesla"
				sx={{
					minWidth: 300,
				}}
			>
				<form onSubmit={handleSubmit}>
					<Box className={'form-div'}>
						{error && error.length > 0 && (
							<Typography color={'error'}>{error}</Typography>
						)}
						<Box>
							<Typography>Nové heslo</Typography>
							<TextField
								className="text-field-edit"
								placeholder="Zadejte nové heslo"
								type="password"
								value={newPassword}
								onChange={(value) => setNewPassword(value)}
							/>
						</Box>
						<Box>
							<Typography>Nové heslo znovu</Typography>
							<TextField
								className="text-field-edit"
								placeholder="Zadejte nové heslo"
								type="password"
								value={newPasswordAgain}
								onChange={(value) => setNewPasswordAgain(value)}
							/>
						</Box>
						<Button variant="contained" color="primary" type="submit">
							Nastavit heslo
						</Button>
					</Box>
				</form>
			</Card>
		</Box>
	)
}

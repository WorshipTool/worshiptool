import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card/Card'
import { Gap } from '@/common/ui/Gap'
import { TextField } from '@/common/ui/TextField/TextField'
import { Typography } from '@/common/ui/Typography'
import useAuth from '@/hooks/auth/useAuth'
import { LOGIN_METHOD_TYPE } from '@/interfaces/user'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import './styles.css'

export default function ChangePassword() {
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [newPasswordAgain, setNewPasswordAgain] = useState('')

	const [error, setError] = useState('')

	const { changePassword, user, login } = useAuth()

	const navigate = useSmartNavigate()

	const { enqueueSnackbar } = useSnackbar()

	const usingPasswordMethod = useMemo(() => {
		return user?.loginMethods.includes(LOGIN_METHOD_TYPE.Email)
	}, [user])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!user) {
			setError('Něco se pokazilo.')
			return
		}

		if (oldPassword === '' || newPassword === '' || newPasswordAgain === '') {
			setError('Všechna pole musí být vyplněna.')
			return
		}

		if (oldPassword === newPassword) {
			setError('Nové heslo nesmí být stejné jako staré.')
			return
		}

		if (newPassword !== newPasswordAgain) {
			setError('Nová hesla se neshodují.')
			return
		}

		try {
			await changePassword(oldPassword, newPassword)

			await login({ email: user.email, password: newPassword })

			enqueueSnackbar('Heslo bylo úspěšně změněno.', { variant: 'success' })
			reset()
		} catch (e) {
			setError(
				'Něco se pokazilo. Zkontrolujte, zda jste správně zadal/a staré heslo.'
			)
		}
	}

	const reset = () => {
		setOldPassword('')
		setNewPassword('')
		setNewPasswordAgain('')
		setError('')
	}

	return usingPasswordMethod ? (
		<Card title="Změna hesla">
			<form onSubmit={handleSubmit}>
				<Box className={'form-div'}>
					<Typography color={'error'}>{error}</Typography>
					<Box>
						<Typography>Staré heslo</Typography>
						<TextField
							className="text-field-edit"
							placeholder="Zadejte původní heslo"
							type="password"
							value={oldPassword}
							onChange={(value) => setOldPassword(value)}
						/>
					</Box>
					<Gap />
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
						Změnit heslo
					</Button>
				</Box>
			</form>
		</Card>
	) : (
		<Card title="Změna hesla">
			<Typography>
				Jsi přihlašen pomocí Google, nemáš heslo, které bys mohl změnit {':('}
			</Typography>
		</Card>
	)
}

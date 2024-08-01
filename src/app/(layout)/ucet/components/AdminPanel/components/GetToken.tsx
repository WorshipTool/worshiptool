import { Token } from '@mui/icons-material'
import { Button, InputBase, Typography } from '@mui/material'
import { useState } from 'react'
import { LoginRequestDTO } from '../../../../../../api/dtos/dtosAuth'
import { Card } from '../../../../../../common/ui/Card/Card'
import { useApi } from '../../../../../../hooks/api/useApi'
import useAuth from '../../../../../../hooks/auth/useAuth'
import { handleApiCall } from '../../../../../../tech/handleApiCall'

export default function GetToken() {
	const { authApi } = useApi()

	const [token, setToken] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { user } = useAuth()

	const showToken = () => {
		const body: LoginRequestDTO = {
			email,
			password,
		}
		handleApiCall(authApi.authControllerLogin(body))
			.then((r) => {
				setToken(r.token)
				navigator.clipboard.writeText(r.token)
			})
			.catch((e) => {
				console.log(e)
			})
	}

	const myToken = () => {
		const t = user?.token || ''
		setToken(t)
		navigator.clipboard.writeText(t)
	}
	return (
		<Card
			icon={<Token />}
			actions={
				<>
					<Button
						onClick={showToken}
						variant="contained"
						disabled={email.trim() === '' || password.trim() === ''}
					>
						Získat token
					</Button>
					<Button onClick={myToken}>Můj token</Button>
				</>
			}
			title="Získej token uživatele"
		>
			<InputBase
				placeholder="Email"
				value={email}
				onChange={(e) => {
					setEmail(e.target.value)
				}}
			/>
			<InputBase
				placeholder="Heslo"
				value={password}
				type="password"
				onChange={(e) => {
					setPassword(e.target.value)
				}}
			/>
			{token != '' && <Typography>Token copied in clipboard...</Typography>}
		</Card>
	)
}

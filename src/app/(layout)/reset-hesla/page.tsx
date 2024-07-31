'use client'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card/Card'
import TextField from '@/common/ui/TextField/TextField'
import { Typography } from '@/common/ui/Typography'
import useAuth from '@/hooks/auth/useAuth'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import './styles.css'

export default function Page() {
	const [email, setEmail] = useState('')

	const [error, setError] = useState('')

	const [done, setDone] = useState(false)

	const navigate = useSmartNavigate()

	const { enqueueSnackbar } = useSnackbar()

	const { generateResetToken } = useAuth()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (email === '') {
			setError('Email musí být vyplněn.')
			return
		}

		try {
			const token = await generateResetToken(email)
			navigate('resetPasswordToken', { token })

			setDone(true)
		} catch (e) {}
	}

	return (
		<Box
			sx={{
				marginTop: 3,
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			{!done ? (
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
								<Typography>Email</Typography>
								<TextField
									className="text-field-edit"
									placeholder="Zadejte email"
									type="email"
									value={email}
									onChange={(value) => setEmail(value)}
								/>
							</Box>
							<Button variant="contained" color="primary" type="submit">
								Poslat reset link
							</Button>
						</Box>
					</form>
				</Card>
			) : (
				<Card
					title="Link odeslán"
					sx={{
						minWidth: 300,
					}}
				>
					<Typography>
						Pro nastavení hesla, běžte do emailu a klikněte na vygenerovaný
						link.
					</Typography>
				</Card>
			)}
		</Box>
	)
}

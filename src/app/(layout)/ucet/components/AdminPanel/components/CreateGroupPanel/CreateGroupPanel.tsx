import { Groups } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React from 'react'
import { Card } from '../../../../../../../common/ui/Card/Card'
import { Gap } from '../../../../../../../common/ui/Gap'
import { useApi } from '../../../../../../../hooks/api/useApi'
import { useSmartNavigate } from '../../../../../../../routes/useSmartNavigate'
import { useApiState } from '../../../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../../../tech/handleApiCall'

export default function CreateGroupPanel() {
	const [name, setName] = React.useState('')
	const [code, setCode] = React.useState('')

	const [submitted, setSubmitted] = React.useState(false)

	const { apiState, fetchApiState } = useApiState()
	const { groupApi } = useApi()

	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)

	const { enqueueSnackbar } = useSnackbar()
	const navigate = useSmartNavigate()

	const onClick = () => {
		setSubmitted(true)
		if (name.trim().length === 0 || code.trim().length === 0) {
			return
		}
		setLoading(true)
		fetchApiState(
			async () => {
				try {
					await handleApiCall(
						groupApi.groupControllerCreateGroup({
							name: name,
							code: code,
						})
					)

					enqueueSnackbar(`Skupina '${code}' byla úspěšně vytvořena.`, {
						variant: 'success',
						action: (
							<Button
								variant="contained"
								color="success"
								onClick={() =>
									navigate('group', {
										groupCode: code,
									})
								}
							>
								Otevřít
							</Button>
						),
					})

					setError(null)
					setName('')
					setCode('')
				} catch (e: any) {
					switch (e.response.status) {
						case 409:
							setError('Skupina s tímto kódem již existuje.')
							break
						default:
							setError('Nastala neočekávaná chyba.')
							break
					}
				} finally {
					setLoading(false)
					setSubmitted(false)
				}
			},
			() => {}
		)
	}

	return (
		<Card title="Vytvoř novou skupinu" icon={<Groups />}>
			<Typography variant="body2">
				Vyplň základní informace a vytvoř novou skupinu.
			</Typography>
			<Gap />
			{error && (
				<>
					<Typography variant="body2" color="error">
						{error}
					</Typography>
					<Gap />
				</>
			)}
			<Box flexDirection={'column'} display={'flex'} gap={2}>
				<TextField
					size="small"
					placeholder="Např. CB Vymyšlená"
					label="Celý název skupiny"
					value={name}
					required
					onChange={(e) => setName(e.target.value)}
					error={submitted && name.trim().length === 0}
					disabled={loading}
				/>
				<TextField
					size="small"
					placeholder="Např. vymyšlená"
					label="Krátký kód skupiny"
					required
					helperText={`Kód tvoří URL adresu -> ${
						code.trim().length > 0 ? code : 'kod'
					}.chvalotce.cz`}
					error={submitted && code.trim().length === 0}
					value={code}
					onChange={(e) => setCode(e.target.value)}
					disabled={loading}
				/>
				<LoadingButton variant="contained" onClick={onClick} loading={loading}>
					Vytvořit skupinu
				</LoadingButton>
			</Box>
		</Card>
	)
}

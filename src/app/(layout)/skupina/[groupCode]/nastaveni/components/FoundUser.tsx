import { Box, Button } from '@/common/ui'
import { TextField } from '@/common/ui/mui'
import { useState } from 'react'
import { useApi } from '../../../../../../hooks/api/useApi'
import { useApiState } from '../../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../../tech/handleApiCall'

type FoundUserProps = {
	onLoad: (userGuid: string) => void
}

export default function FoundUser(props: FoundUserProps) {
	const { apiState, fetchApiState } = useApiState()
	const { authApi } = useApi()

	const [email, setEmail] = useState('')
	const [lastEmail, setLastEmail] = useState('')

	const [loading, setLoading] = useState(false)

	const handleSearch = () => {
		setLoading(true)
		fetchApiState(
			async () => {
				try {
					const result = await handleApiCall(
						authApi.authControllerGetUserGuidFromEmail(email)
					)

					setLastEmail(email)

					return result
				} catch (e: any) {
					setLoading(false)
					throw new Error(e)
				}
			},
			(r: any) => {
				setLoading(false)
				props.onLoad(r)
			}
		)
	}
	return (
		<Box>
			<TextField
				placeholder="Zadejte email..."
				disabled={loading}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				size="small"
				helperText={apiState.error ? 'Uživatel nebyl nalezen' : ''}
				error={Boolean(apiState.error)}
			/>
			<Button onClick={handleSearch} loading={loading}>
				Přidat
			</Button>
		</Box>
	)
}

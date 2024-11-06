import { Button, Typography } from '@/common/ui'
import { ButtonGroup, Input, StepContent, StepLabel } from '@/common/ui/mui'
import { useEffect, useState } from 'react'
import { Gap } from '../../../../../../../common/ui/Gap/Gap'
import { useApi } from '../../../../../../../hooks/api/useApi'
import { useApiState } from '../../../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../../../tech/handleApiCall'

type FirstStepProps = {
	onLoad: (userGuid: string) => void
	active?: boolean
}

export default function FirstStep(props: FirstStepProps) {
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

					props.onLoad(result)
					return result
				} catch (e: any) {
					throw new Error(e)
				}
			},
			() => {
				setLoading(false)
			}
		)
	}

	useEffect(() => {
		if (props.active) {
			setEmail('')
			setLastEmail('')
			apiState.data = undefined
		}
	}, [props.active])

	return (
		<>
			<StepLabel optional={lastEmail}>1. Vyhledej uživatele</StepLabel>
			<StepContent>
				<ButtonGroup size="small">
					<Input
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
						disabled={loading}
						autoFocus
					/>
					<Button
						variant="contained"
						onClick={handleSearch}
						loading={loading}
						disabled={email.trim() === '' || email === lastEmail}
					>
						Hledat
					</Button>
				</ButtonGroup>
				<Gap />
				{apiState.error && (
					<Typography color={'error'}>Uživatel nebyl nalezen</Typography>
				)}
			</StepContent>
		</>
	)
}

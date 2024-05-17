import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import useAuth from '../../../../hooks/auth/useAuth'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import {
	networkErrorEvent,
	unauthorizedEvent,
} from '../../../../tech/handleApiCall'

interface ErrorHandlerProviderProps {
	children: React.ReactNode
}

export default function ErrorHandlerProvider(props: ErrorHandlerProviderProps) {
	const { enqueueSnackbar } = useSnackbar()
	const { isLoggedIn, signup } = useAuth()
	const navigate = useSmartNavigate()

	useEffect(() => {
		const ne = () => {
			enqueueSnackbar('Nelze se spojit se serverem.', {
				variant: 'error',
				persist: true,
				preventDuplicate: true,
				action: () => {
					return (
						<Button
							onClick={() => window?.location.reload()}
							color="inherit"
							variant="outlined"
							size="small"
						>
							Zkusit to znovu
						</Button>
					)
				},
			})
		}

		const ue = () => {
			navigate('login', {
				previousPage: window.location.pathname,
				message: 'Je třeba se znovu přihlásit.',
			})
			enqueueSnackbar('Je třeba se znovu přihlásit.', {
				persist: true,
			})
		}
		window.addEventListener(networkErrorEvent.type, ne)
		window.addEventListener(unauthorizedEvent.type, ue)

		return () => {
			window.removeEventListener(networkErrorEvent.type, ne)
			window.removeEventListener(unauthorizedEvent.type, ue)
		}
	}, [])
	return <>{props.children}</>
}

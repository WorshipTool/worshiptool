'use client'
import { Gap } from '@/common/ui/Gap'
import { Lock } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect } from 'react'
import useAuth from '../../../../hooks/auth/useAuth'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import {
	networkErrorEvent,
	norequiredPermissionEvent,
	unauthorizedEvent,
} from '../../../../tech/handleApiCall'

interface ErrorHandlerProviderProps {
	children: React.ReactNode
}

export default function ErrorHandlerProvider(props: ErrorHandlerProviderProps) {
	const { enqueueSnackbar } = useSnackbar()
	const { logout } = useAuth()
	const navigate = useSmartNavigate()

	const ne = useCallback(() => {
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
	}, [enqueueSnackbar])

	const ue = useCallback(() => {
		logout()
		navigate('login', {
			previousPage: window.location.pathname,
			message: 'Je třeba se znovu přihlásit.',
		})
		enqueueSnackbar('Je třeba se znovu přihlásit.', {
			persist: true,
		})
	}, [enqueueSnackbar, logout, navigate])

	const noPermission = useCallback(() => {
		enqueueSnackbar(
			<>
				<Lock />
				<Gap horizontal />
				Nemáte dostatečná oprávnění.
			</>
		)
	}, [enqueueSnackbar])

	useEffect(() => {
		window.addEventListener(networkErrorEvent, ne)
		window.addEventListener(unauthorizedEvent, ue)
		window.addEventListener(norequiredPermissionEvent, noPermission)

		return () => {
			window.removeEventListener(networkErrorEvent, ne)
			window.removeEventListener(unauthorizedEvent, ue)
			window.removeEventListener(norequiredPermissionEvent, noPermission)
		}
	}, [ne, ue, noPermission])
	return <>{props.children}</>
}

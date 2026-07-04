'use client'

import { Box, Button, CircularProgress, Typography } from '@/common/ui'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import { useTranslations } from 'next-intl'
import { useSnackbar } from 'notistack'
import { ReactNode, useEffect } from 'react'
import { ApiState } from '../../../tech/ApiState'
import { isDevelopment } from '../../../tech/development.tech'

type ApiStateArray<T extends unknown[]> = { [P in keyof T]: ApiState<T[P]> }

interface SkeletonLoaderProps<T extends unknown[]> {
	data: ApiStateArray<T>
	render?: (data: T) => ReactNode
	renderLoading?: () => ReactNode
	renderError?: () => ReactNode
}

const ApiStateStatus = {
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
	LOADING: 'LOADING',
	INVALIDATED: 'NONE',
}

const getApiStateStatus = (apiStates: ApiState[]) => {
	if (apiStates.some((apiState) => apiState.loading))
		return ApiStateStatus.LOADING
	if (apiStates.every((apiState) => apiState.success))
		return ApiStateStatus.SUCCESS
	if (apiStates.some((apiState) => apiState.error)) return ApiStateStatus.ERROR
	return ApiStateStatus.INVALIDATED
}

export function SkeletonLoaderCore<T extends unknown[]>({
	data,
	render,
	renderLoading,
	renderError,
}: SkeletonLoaderProps<T>) {
	const status = getApiStateStatus(data as ApiState[])

	const t = useTranslations('errors')
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	useEffect(() => {
		if (!isDevelopment) return
		if (renderError) return

		if (status === ApiStateStatus.ERROR) {
			enqueueSnackbar(
				<div>
					Nastala chyba při načítání dat. <b>Implementuj renderError</b>
				</div>,
				{
					variant: 'error',
					persist: true,
					action: (
						<Button variant="contained" color="error">
							Zavřít
						</Button>
					),
					// onClick: () => closeSnackbar(),
				}
			)
		}
	}, [status, renderError])

	return (
		<>
			{status === ApiStateStatus.SUCCESS &&
				render?.(data.map((state) => state.data) as T)}
			{status === ApiStateStatus.ERROR &&
				(renderError ? (
					renderError()
				) : (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 1,
							padding: 4,
							textAlign: 'center',
						}}
					>
						<ErrorOutline sx={{ fontSize: '2.5rem', color: 'grey.500' }} />
						<Typography color="grey.700">{t('dataLoadFailed')}</Typography>
					</Box>
				))}
			{status === ApiStateStatus.LOADING &&
				(renderLoading?.() ?? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							padding: 4,
						}}
					>
						<CircularProgress />
					</Box>
				))}
			{status === ApiStateStatus.INVALIDATED && <div></div>}
		</>
	)
}

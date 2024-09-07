'use client'
import { Group } from '@/api/generated'
import Popup from '@/common/components/Popup/Popup'
import { useApi } from '@/hooks/api/useApi'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Search } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, DialogContentText, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { searchGroupsEvent } from '../hooks/useToolsMenuItems'

export default function SearchGroupDialog() {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = useState('')

	const { groupApi } = useApi()

	const { apiState, fetchApiState } = useApiState<Group[]>()

	const navigate = useSmartNavigate()

	useEffect(() => {
		if (open) {
			setValue('')
		}
	}, [open])

	useEffect(() => {
		const handler = () => {
			setOpen(true)
		}
		window.addEventListener(searchGroupsEvent.type, handler)
		return () => {
			window.removeEventListener(searchGroupsEvent.type, handler)
		}
	}, [])

	const onSearch = () => {
		fetchApiState(
			async () => {
				const result = await handleApiCall(
					groupApi.groupControllerSearchGroups(value)
				)
				if (result.length === 0) {
					throw new Error('Skupina nebyla nalezena')
				}
				return result
			},
			(result) => {
				navigate('group', {
					groupCode: result[0].code,
				})
				setOpen(false)
			}
		)
	}

	return (
		<Popup
			open={open}
			onClose={() => setOpen(false)}
			title={'Hledat skupinu'}
			width={350}
			actions={
				<>
					<LoadingButton
						variant="contained"
						onClick={onSearch}
						startIcon={<Search />}
						loading={apiState.loading}
						sx={{ flex: 1 }}
						type="submit"
					>
						Hledat a otevřít
					</LoadingButton>
				</>
			}
		>
			<DialogContentText>
				Zadejte část kódu nebo názvu skupiny, kterou chcete otevřít.
			</DialogContentText>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				<TextField
					autoFocus
					placeholder="Kód skupiny"
					size="small"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					helperText={apiState.error?.message}
					error={!!apiState.error?.message}
					disabled={apiState.loading}
				/>
			</Box>
		</Popup>
	)
}

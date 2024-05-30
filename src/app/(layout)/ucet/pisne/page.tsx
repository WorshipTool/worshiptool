'use client'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { mapSongVariantDataOutDtoToSongVariantDto } from '../../../../api/dtos'
import { useApi } from '../../../../hooks/api/useApi'
import useAuth from '../../../../hooks/auth/useAuth'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import { handleApiCall } from '../../../../tech/handleApiCall'
import MySongItem from './components/MySongItem'
import Loading from './loading'

export default async function MySongsList() {
	const { isLoggedIn } = useAuth()
	const { songGettingApi } = useApi()
	const navigate = useSmartNavigate()

	const [init, setInit] = useState(false)
	useEffect(() => {
		setInit(true)
	}, [])

	if (!init) return <Loading />

	if (!isLoggedIn())
		return <Typography> Pro zobrazení písní je třeba být přihlášen</Typography>

	try {
		const result = await handleApiCall(
			songGettingApi.songGettingControllerGetSongListOfUser()
		)
		const variants = result.variants.map((variant) => {
			return mapSongVariantDataOutDtoToSongVariantDto(variant)
		})

		return (
			<Box>
				{variants.map((variant, index) => {
					return (
						<MySongItem
							variant={variant}
							index={index}
							key={`mysong${variant.guid}`}
						></MySongItem>
					)
				})}

				{variants.length == 0 && (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: 2,
						}}
					>
						<Typography>Nemáš žádné vytvořené písně.</Typography>
						<Button
							onClick={() => {
								navigate('addMenu', {})
							}}
							variant="contained"
						>
							Vytvořit
						</Button>
					</Box>
				)}
			</Box>
		)
	} catch (e) {
		return <Typography>Chyba při načítání písní</Typography>
	}
}

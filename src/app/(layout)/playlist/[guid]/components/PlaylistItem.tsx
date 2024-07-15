import { Add, Remove } from '@mui/icons-material'
import { Box, IconButton, Paper, Skeleton, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import useInnerPlaylist from '../hooks/useInnerPlaylist'

import { Sheet } from '@pepavlin/sheet-api'
import DefaultStyle from '../../../../../common/components/SheetDisplay/styles/DefaultStyle'
import { Button } from '../../../../../common/ui/Button'
import useAuth from '../../../../../hooks/auth/useAuth'
import useCurrentPlaylist from '../../../../../hooks/playlist/useCurrentPlaylist'
import { PlaylistItemDto } from '../../../../../interfaces/playlist/playlist.types'
import { parseVariantAlias } from '../../../../../routes'
import { useSmartNavigate } from '../../../../../routes/useSmartNavigate'

const PageBreak = () => {
	return (
		<Box
			sx={{
				pageBreakAfter: 'always',
			}}
		></Box>
	)
}

interface PlaylistItemProps {
	item: PlaylistItemDto
}

export const PlaylistItem = ({ item }: PlaylistItemProps) => {
	const {
		removeVariant,
		items,
		playlist,
		guid: playlistGuid,
		loading,
		setItemsKeyChord,
		isOwner,
		reload,
	} = useInnerPlaylist()
	const { turnOn } = useCurrentPlaylist()

	const [sheet, setSheet] = React.useState<Sheet>(
		new Sheet(item.variant.sheetData)
	)
	const [number, setNumber] = React.useState(0)

	const { user, isLoggedIn } = useAuth()

	const [removing, setRemoving] = React.useState(false)
	const [saving, setSaving] = React.useState(0)

	const onRemove = async () => {
		setRemoving(true)
		try {
			await removeVariant(item.variant.packGuid)
		} catch (e) {
			console.error(e)
		}
		setRemoving(false)

		turnOn(playlistGuid)
		await reload()
	}

	const transpose = async (value: number) => {
		setSaving((s) => s + 1)
		sheet.transpose(value)
		rerender()

		if (isOwner) {
			const c = sheet.getKeyChord()
			if (c) await setItemsKeyChord(item, c)
		}
		setSaving((s) => s - 1)
	}

	const navigate = useSmartNavigate()

	const rerender = () => {
		setNumber((prev) => prev + 1)
	}

	useEffect(() => {
		sheet.setKey(item.toneKey)
		rerender()
	}, [item])

	if (loading)
		return (
			<>
				<Skeleton variant="text" width={'50%'}></Skeleton>
				{Array(10)
					.fill(0)
					.map((a, i) => (
						<Skeleton
							key={i}
							variant="text"
							width={Math.round(Math.random() * 40) + '%'}
						></Skeleton>
					))}
			</>
		)
	return (
		<>
			<Paper sx={{ padding: 2, marginBottom: 1, displayPrint: 'none' }}>
				<Box
					position={'absolute'}
					marginTop={-13}
					id={'playlistItem_' + item.guid}
				></Box>

				<Box
					display={'flex'}
					flexDirection={'row'}
					justifyContent={'space-between'}
				>
					{isOwner ? (
						<Box
							display={{
								xs: 'none',
								sm: 'flex',
							}}
						>
							<IconButton
								onClick={() => {
									transpose(1)
								}}
								color="inherit"
							>
								<Add />
							</IconButton>
							<IconButton
								onClick={() => {
									transpose(-1)
								}}
								color="inherit"
							>
								<Remove />
							</IconButton>
						</Box>
					) : (
						<Box />
					)}
					<Box />

					{saving > 0 && (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'start',
								paddingLeft: 1,
							}}
							flex={1}
						>
							<Typography variant="subtitle2">Ukládání...</Typography>
						</Box>
					)}

					<Box display={'flex'} flexDirection={'row'}>
						{isOwner && (
							<Box
								display={{
									xs: 'none',
									sm: 'block',
								}}
							>
								<Button
									loading={removing}
									variant="text"
									color="error"
									onClick={onRemove}
								>
									Odebrat z playlistu
								</Button>
							</Box>
						)}
						<Button
							variant="text"
							to="variant"
							toParams={{
								...parseVariantAlias(item.variant.alias),
							}}
						>
							Otevřít
						</Button>
					</Box>
				</Box>

				<DefaultStyle
					sheet={sheet}
					title={item.variant.preferredTitle}
					columns={1}
					hideChords={false}
				/>
			</Paper>

			<Box display={'none'} displayPrint={'block'}>
				<DefaultStyle
					sheet={sheet}
					title={item.variant.preferredTitle}
					columns={1}
					hideChords={false}
				/>
				{items.length > 1 && <PageBreak />}
			</Box>
		</>
	)
}

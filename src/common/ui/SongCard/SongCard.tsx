'use client'

import { Lock, Public } from '@mui/icons-material'
import { Box, styled, Typography, useTheme } from '@mui/material'
import { SongVariantDto } from '../../../api/dtos'
import useAuth from '../../../hooks/auth/useAuth'
import { parseVariantAlias } from '../../../routes'
import CustomChip from '../CustomChip/CustomChip'
import { Link } from '../Link/CustomLink'

const StyledContainer = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.grey[100],

	padding: '1rem',
	borderRadius: '0.5rem',
	'&:hover': {
		backgroundColor: theme.palette.grey[200],
		boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
		'& .songcardgradient': {
			background: `linear-gradient(0deg, ${theme.palette.grey[200]} 50%, transparent)`,
		},
	},
	cursor: 'pointer',
	borderWidth: 1.4,
	borderStyle: 'solid',
	position: 'relative',
}))

const StyledBox = styled(Box)(({ theme }) => ({
	maxWidth: 'calc(100vw - 3rem)',
	overflow: 'hidden',
}))

type PublicityMode = 'none' | 'private' | 'byyou' | 'privateandloader' | 'all'

type SongCardProps = {
	data: SongVariantDto
	publicityMode?: PublicityMode
	flexibleHeght?: boolean
}
export function SongCard({
	data,
	publicityMode,
	flexibleHeght = true,
}: SongCardProps) {
	const { user } = useAuth()
	const theme = useTheme()

	const createdByYou = user && data.createdBy === user.guid

	// What display
	let showCreatedByLoader = data.createdByLoader
	let showPrivate = !data.public && createdByYou
	let showPublic = data.public && !createdByYou

	switch (publicityMode) {
		case 'private':
			showPublic = false
			showCreatedByLoader = false
			break
		case 'byyou':
			showCreatedByLoader = false
			break
		case 'privateandloader':
			showPublic = false
			break
		case 'all':
			break
		case 'none':
			showPublic = false
			showPrivate = false
			showCreatedByLoader = false
			break
	}

	const showBorder = showPrivate

	// Title and sheet data to display
	const title = data.preferredTitle
	const dataLines = data.sheet.getSections()[0]?.text?.split('\n').slice(0, 4)

	return (
		<Link
			to={'variant'}
			params={{
				...parseVariantAlias(data.alias),
				title: data.preferredTitle,
			}}
		>
			<StyledContainer
				sx={{
					borderColor: showBorder ? theme.palette.grey[300] : 'transparent',
					height: flexibleHeght ? 'auto' : '11rem',
					overflowY: 'hidden',
				}}
			>
				<Box display={'flex'} flexDirection={'row'} gap={1}>
					<Typography fontWeight={'bold'} flex={1}>
						{title}
					</Typography>
					<Box>
						{(showPrivate || showPublic) && (
							<CustomChip
								icon={showPrivate ? <Lock /> : <Public />}
								label={showPrivate ? 'Soukromé' : 'Vytvořeno vámi'}
								color={
									showPrivate
										? theme.palette.grey[600]
										: theme.palette.primary.main
								}
								borderColor={
									showPrivate
										? theme.palette.grey[400]
										: theme.palette.primary.main
								}
							/>
						)}
						{showCreatedByLoader && (
							<Typography variant="caption">Nahráno programem</Typography>
						)}
					</Box>
				</Box>

				<StyledBox>
					{dataLines.map((line, index) => {
						return (
							<Box display={'flex'} flexDirection={'row'} key={line}>
								<Typography noWrap key={'SearchItemText' + index} flex={1}>
									{line}
								</Typography>
							</Box>
						)
					})}
				</StyledBox>

				<Box
					className="songcardgradient"
					sx={{
						background: `linear-gradient(0deg, ${theme.palette.grey[100]} 50%, transparent)`,

						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: '1rem',
					}}
				/>
			</StyledContainer>
		</Link>
	)
}

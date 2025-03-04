'use client'

import { Box } from '@/common/ui/Box'
import { SxProps } from '@/common/ui/mui'
import SongCardAdditional from '@/common/ui/SongCard/components/SongCardAdditional'
import { Typography } from '@/common/ui/Typography'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { parseVariantAlias } from '@/routes/routes.tech'
import { Lock, Public } from '@mui/icons-material'
import { alpha, styled, useTheme } from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'
import { ComponentProps, memo, useEffect, useMemo, useState } from 'react'
import { BasicVariantPack } from '../../../api/dtos'
import useAuth from '../../../hooks/auth/useAuth'
import { CustomChip } from '../CustomChip/CustomChip'
import { Link } from '../Link/Link'

const StyledContainer = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.grey[100],

	borderRadius: '0.5rem',
	'&:hover': {
		backgroundColor: theme.palette.grey[200],
		boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
		'& .songcardgradient': {
			background: `linear-gradient(0deg, ${theme.palette.grey[200]} 50%, transparent)`,
		},
	},
	cursor: 'pointer',
	outlineWidth: 1.4,
	outlineStyle: 'solid',
	position: 'relative',
}))

const SONG_CARD_PROPERTIES = [
	'SHOW_PRIVATE_LABEL',
	'SHOW_YOUR_PUBLIC_LABEL',
	'SHOW_ADDED_BY_LOADER',
] as const
type SongCardProperty = (typeof SONG_CARD_PROPERTIES)[number]

type ToLinkProps = (data: BasicVariantPack) => {
	to: ComponentProps<typeof Link>['to']
	params: ComponentProps<typeof Link>['params']
} | null

type SongCardIconData = (data: BasicVariantPack) => {
	icon: JSX.Element
}[]

type SongCardProps = {
	data: BasicVariantPack
	flexibleHeight?: boolean
	properties?: SongCardProperty[]
	toLinkProps?: ToLinkProps
	selected?: boolean
	selectable?: boolean
	onClick?: () => void
	onSelect?: (selected: boolean) => void
	onDeselect?: (selected: boolean) => void
	icons?: SongCardIconData
	sx?: SxProps
}
export const SongCard = memo(function S({
	data,
	flexibleHeight: flexibleHeght = true,
	...props
}: SongCardProps) {
	const { user } = useAuth()
	const theme = useTheme()

	const [isOver, setIsOver] = useState(false)

	const [selected, setSelected] = useState<boolean>(props.selected || false)
	useEffect(() => {
		setSelected(props.selected || false)
	}, [props.selected])

	const createdByYou = user && data.createdByGuid === user.guid

	// Generate object from array properties
	const properties: Record<SongCardProperty, boolean> = useMemo(() => {
		const result: Record<SongCardProperty, boolean> = {} as any
		SONG_CARD_PROPERTIES.forEach((property) => {
			result[property] = props.properties?.includes(property) ?? false
		})
		return result
	}, [])

	const createdByLoaderEnabled = properties.SHOW_ADDED_BY_LOADER
	const privateLabelEnabled = properties.SHOW_PRIVATE_LABEL
	const yourPublicLabelEnabled = properties.SHOW_YOUR_PUBLIC_LABEL

	// What display
	const showPrivate = !data.public && createdByYou && privateLabelEnabled
	const showYourPublic = data.public && createdByYou && yourPublicLabelEnabled

	// Title and sheet data to display
	const title = data.title
	const sheet = new Sheet(data.sheetData)
	const dataLines = sheet.getSections()[0]?.text?.split('\n').slice(0, 4)

	const linkProps = useMemo(() => {
		if (props.toLinkProps) {
			return props.toLinkProps(data)
		}
		return null
	}, [data])

	const onClick = () => {
		props.onClick?.()

		if (props.selectable) {
			const newValue = !selected
			setSelected(newValue)

			if (newValue) {
				props.onSelect?.(newValue)
			} else {
				props.onDeselect?.(newValue)
			}
		}
	}

	const draggable = useMemo(() => {
		return !props.selectable
	}, [props.selectable])

	return (
		<DraggableSong
			data={{
				packGuid: data.packGuid,
				alias: data.packAlias,
				title: title,
			}}
			draggable={draggable}
		>
			<Link
				to={linkProps?.to || 'variant'}
				params={
					linkProps?.params || {
						...parseVariantAlias(data.packAlias),
					}
				}
				disabled={(props.toLinkProps && !linkProps) || props.selectable}
			>
				<StyledContainer
					sx={{
						outlineColor: showPrivate ? theme.palette.grey[300] : 'transparent',

						height: flexibleHeght ? 'auto' : '11rem',
						overflowY: 'hidden',

						...(selected && {
							outlineColor: 'primary.main',
							outlineWidth: 2,
							outlineStyle: 'solid',
						}),
						userSelect: 'none',
						...(props.sx || {}),
					}}
					onClick={onClick}
					onMouseEnter={() => setIsOver(true)}
					onMouseLeave={() => setIsOver(false)}
				>
					<Box
						sx={{
							position: 'relative',
							padding: '1rem',
							...(selected && {
								borderColor: 'primary.main',
								borderWidth: 2,
								bgcolor: alpha(theme.palette.primary.main, 0.1),

								'&:hover': {
									bgcolor: alpha(theme.palette.primary.main, 0.2),
								},
							}),
							height: 'calc(100% - 2rem)',
							display: 'flex',
							flexDirection: 'column',
							overflow: 'hidden',
						}}
					>
						<Box display={'flex'} flexDirection={'row'} gap={1}>
							<Typography
								strong
								sx={{
									flex: 1,
								}}
							>
								{title}
							</Typography>
							<Box>
								{(showPrivate || showYourPublic) && (
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
								{createdByLoaderEnabled && data.createdByLoader && (
									<Typography size={'small'}>Nahráno programem</Typography>
								)}
							</Box>
						</Box>

						<Box
							sx={{
								maxWidth: 'calc(100vw - 3rem)',
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								flex: 1,
							}}
						>
							<Box
								sx={{
									overflow: 'hidden',
								}}
							>
								{dataLines.map((line, index) => {
									return (
										<Box
											display={'flex'}
											flexDirection={'row'}
											key={line + index}
										>
											<Typography
												key={'SearchItemText' + index}
												sx={{
													flex: 1,
												}}
											>
												{line}
											</Typography>
										</Box>
									)
								})}
							</Box>
							<SongCardAdditional
								isOver={isOver}
								data={data}
								icons={props.icons}
							/>
						</Box>
					</Box>
				</StyledContainer>
			</Link>
		</DraggableSong>
	)
})

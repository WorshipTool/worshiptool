'use client'

import SongCardDragTemplate from '@/common/ui/SongCard/SongCardDragTemplate'
import { SONG_DRAG_DATA_TYPE, mapVariantToDragDto } from '@/hooks/dragsong/tech'
import { Lock, Public } from '@mui/icons-material'
import { Box, Typography, alpha, styled, useTheme } from '@mui/material'
import {
	ComponentProps,
	DragEventHandler,
	memo,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { SongVariantDto } from '../../../api/dtos'
import useAuth from '../../../hooks/auth/useAuth'
import { getRouteUrlWithParams, parseVariantAlias } from '../../../routes'
import CustomChip from '../CustomChip/CustomChip'
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

const StyledBox = styled(Box)(({ theme }) => ({
	maxWidth: 'calc(100vw - 3rem)',
	overflow: 'hidden',
}))

const SONG_CARD_PROPERTIES = [
	'SHOW_PRIVATE_LABEL',
	'SHOW_YOUR_PUBLIC_LABEL',
	'SHOW_ADDED_BY_LOADER',
] as const
type SongCardProperty = (typeof SONG_CARD_PROPERTIES)[number]

type ToLinkProps = (data: SongVariantDto) => {
	to: ComponentProps<typeof Link>['to']
	params: ComponentProps<typeof Link>['params']
} | null

type SongCardProps = {
	data: SongVariantDto
	flexibleHeight?: boolean
	properties?: SongCardProperty[]
	toLinkProps?: ToLinkProps
	selected?: boolean
	selectable?: boolean
	onClick?: () => void
	onSelect?: (selected: boolean) => void
	onDeselect?: (selected: boolean) => void
}
export const SongCard = memo(function S({
	data,
	flexibleHeight: flexibleHeght = true,
	...props
}: SongCardProps) {
	const { user } = useAuth()
	const theme = useTheme()

	const [selected, setSelected] = useState<boolean>(props.selected || false)
	useEffect(() => {
		setSelected(props.selected || false)
	}, [props.selected])

	const createdByYou = user && data.createdBy === user.guid

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
	const showYourPublic = data.public && !createdByYou && yourPublicLabelEnabled

	// Title and sheet data to display
	const title = data.preferredTitle
	const dataLines = data.sheet.getSections()[0]?.text?.split('\n').slice(0, 4)

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

	const [dragging, setDragging] = useState(false)

	const img = useRef<HTMLDivElement>(null)

	const onDragStart: DragEventHandler<HTMLDivElement> = (e) => {
		setDragging(true)
		if (!img.current) return
		e.dataTransfer.setDragImage(img.current, 50, 50)

		// set url to data
		const url = getRouteUrlWithParams(
			'variant',
			parseVariantAlias(data.packAlias)
		)
		e.dataTransfer.setData('text/uri-list', url)
		e.dataTransfer.setData('text/plain', title)
		e.dataTransfer.setData(
			SONG_DRAG_DATA_TYPE,
			JSON.stringify(mapVariantToDragDto(data))
		)
	}

	const onDragEnd = () => {
		setDragging(false)
	}

	const draggable = useMemo(() => {
		return !props.selectable
	}, [props.selectable])

	return (
		<Link
			to={linkProps?.to || 'variant'}
			params={
				linkProps?.params || {
					...parseVariantAlias(data.packAlias),
				}
			}
			disabled={(props.toLinkProps && !linkProps) || props.selectable}
		>
			<SongCardDragTemplate title={title} ref={img} />
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

					...(dragging && {
						opacity: 0.5,
					}),
				}}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				draggable={draggable}
				onClick={onClick}
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
						height: '100%',
					}}
				>
					<Box display={'flex'} flexDirection={'row'} gap={1}>
						<Typography fontWeight={'bold'} flex={1}>
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
								<Typography variant="caption">Nahráno programem</Typography>
							)}
						</Box>
					</Box>

					<StyledBox>
						{dataLines.map((line, index) => {
							return (
								<Box display={'flex'} flexDirection={'row'} key={line + index}>
									<Typography noWrap key={'SearchItemText' + index} flex={1}>
										{line}
									</Typography>
								</Box>
							)
						})}
					</StyledBox>

					{/* <Box
                        className="songcardgradient"
                        sx={{
                            background: `linear-gradient(0deg, ${
                                selected
                                    ? lighten(theme.palette.primary.main, 0.8)
                                    : theme.palette.grey[100]
                            } 50%, transparent)`,
                    
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '1rem',
                        }}
                    /> */}
				</Box>
			</StyledContainer>
		</Link>
	)
})

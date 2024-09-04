'use client'
import { mapSongVariantDataOutDtoToSongVariantDto } from '@/api/dtos'
import PopupContainer from '@/common/components/Popup/PopupContainer'
import GlobalSongList from '@/common/components/SongSelectPopup/components/GlobalSongList'
import SelectFromOptions from '@/common/components/SongSelectPopup/components/SelectFromOptions'
import { SelectSearch } from '@/common/components/SongSelectPopup/components/SelectSearch'
import SelectedPanel from '@/common/components/SongSelectPopup/components/SelectedPanel'
import UsersSongList from '@/common/components/SongSelectPopup/components/UsersSongList'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { VariantPackGuid } from '../../../interfaces/variant/songVariant.types'
import './styles.css'

type PopupProps = {
	onClose?: () => void
	open?: boolean
	onSubmit?: (packs: VariantPackGuid[]) => void

	anchorRef: React.RefObject<HTMLElement>
	anchorName: string

	filterFunc?: (pack: VariantPackGuid) => boolean
}

export type ChosenSong = {
	guid: VariantPackGuid
	title: string
}

export default function SongSelectPopup(props: PopupProps) {
	const [chosen, setChosen] = useState<ChosenSong[]>([])

	const [optionSelected, setOptionSelected] = useState(0)

	const [searchStringRaw, setSearchStringRaw] = useState('')
	const [searchString, setSearchString] = useState('')

	useChangeDelayer(searchStringRaw, setSearchString, [])

	const { songGettingApi } = useApi()

	const [globalApiState] = useApiStateEffect(async () => {
		const result = await handleApiCall(
			songGettingApi.songGettingControllerSearchGlobalSongsInPopup(searchString)
		)

		return (
			result.variants
				.map((v) => {
					return mapSongVariantDataOutDtoToSongVariantDto(v)
				})
				.filter((v) => {
					return props.filterFunc?.(v.packGuid) ?? true
				})
				// make it unique
				.filter(
					(v, i, a) => a.findIndex((t) => t.packGuid === v.packGuid) === i
				)
		)
	}, [searchString, props.filterFunc])

	const [usersApiState] = useApiStateEffect(async () => {
		const result = await handleApiCall(
			songGettingApi.songGettingControllerSearchMySongsInPopup(searchString)
		)

		return (
			result.variants
				.map((v) => {
					return mapSongVariantDataOutDtoToSongVariantDto(v)
				})
				.filter((v) => {
					return props.filterFunc?.(v.packGuid) ?? true
				})
				// make it unique
				.filter(
					(v, i, a) => a.findIndex((t) => t.packGuid === v.packGuid) === i
				)
		)
	}, [searchString, props.filterFunc])

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		props.onSubmit?.(chosen.map((c) => c.guid))
		onClose()
		e.preventDefault()
	}

	const popupRef = useRef(null)
	const [position, setPosition] = useState<{
		top: number
		left?: number
		right?: number
	}>({ top: 0, left: 0 })

	const MAX_WIDTH = 500
	const OFFSET = 8

	useEffect(() => {
		const updatePopupPosition = () => {
			if (props.anchorRef?.current) {
				const rect = props.anchorRef.current.getBoundingClientRect()
				const toRightMode = rect.left < window.innerWidth / 2
				if (toRightMode) {
					const t = rect.top + OFFSET
					const l = rect.left + OFFSET
					setPosition({
						top: t,
						left: Math.min(l, window.innerWidth - MAX_WIDTH - OFFSET),
					})
				} else {
					const t = rect.top + OFFSET
					const r = window.innerWidth - rect.right + OFFSET

					setPosition({
						top: t,
						right: Math.max(r, OFFSET),
					})
				}
			}
		}

		updatePopupPosition() // Initial position

		window.addEventListener('scroll', updatePopupPosition)
		window.addEventListener('resize', updatePopupPosition)

		return () => {
			window.removeEventListener('scroll', updatePopupPosition)
			window.removeEventListener('resize', updatePopupPosition)
		}
	}, [props.anchorRef, props.anchorName])

	const onClose = () => {
		props.onClose?.()
		setChosen([])
		setOptionSelected(0)
		setSearchStringRaw('')
	}

	return !props.open ? null : (
		<PopupContainer>
			<Box
				sx={{
					position: 'absolute',
					left: 0,
					top: 0,
					bottom: 0,
					right: 0,
					pointerEvents: 'auto',
				}}
				onClick={onClose}
			>
				<form onSubmit={onSubmit} onReset={onClose}>
					<Box
						ref={popupRef}
						// className={'song-select-popup '}
						sx={{
							bgcolor: 'grey.200',
							maxWidth: `min(${MAX_WIDTH}px, calc(100% - ${OFFSET * 2}px))`,
							width: MAX_WIDTH,
							borderRadius: 3,
							boxShadow: '0px 0px 15px rgba(0,0,0,0.25)',
							position: 'fixed',
							left: position.left,
							right: position.right,
							top: position.top,
							transition: 'all 0.2s',
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<Box padding={4} display={'flex'} flexDirection={'column'} gap={3}>
							<Box display={'flex'} flexDirection={'column'} gap={1}>
								<Box
									display={'flex'}
									flexDirection={'row'}
									justifyContent={'space-between'}
									gap={2}
								>
									<Typography variant="h4" strong>
										Vyberte píseň
									</Typography>
									<SelectSearch
										value={searchStringRaw}
										onChange={setSearchStringRaw}
									/>
								</Box>
								<SelectFromOptions
									options={[
										{
											label: 'Z globálního zpěvníku',
										},
										{
											label: 'Z mých písní',
											count:
												searchString.length === 0
													? undefined
													: usersApiState?.data?.length || 0,
										},
									]}
									initialSelected={optionSelected}
									onSelect={(item, i) => setOptionSelected(i)}
								/>
							</Box>

							<Box>
								{optionSelected === 0 && (
									<GlobalSongList
										onSongSelect={(g, t) => {
											if (chosen.find((c) => c.guid === g)) return
											setChosen([...chosen, { guid: g, title: t }])
										}}
										onSongDeselect={(g) => {
											setChosen(chosen.filter((c) => c.guid !== g))
										}}
										selectedSongs={chosen.map((v) => v.guid)}
										apiState={globalApiState}
									/>
								)}
								{optionSelected === 1 && (
									<UsersSongList
										onSongSelect={(g, t) => {
											if (chosen.find((c) => c.guid === g)) return
											setChosen([...chosen, { guid: g, title: t }])
										}}
										onSongDeselect={(g) => {
											setChosen(chosen.filter((c) => c.guid !== g))
										}}
										selectedSongs={chosen.map((v) => v.guid)}
										apiState={usersApiState}
									/>
								)}
							</Box>

							<Box display={'flex'} flexDirection={'column'} gap={3}>
								<SelectedPanel
									selected={chosen}
									onDeselect={(g) => {
										setChosen(chosen.filter((c) => c.guid !== g))
									}}
								/>

								<Box display={'flex'} justifyContent={'end'} gap={2}>
									<Button color="grey.700" type="reset" variant="text">
										Zrušit
									</Button>
									<Button
										color={'primarygradient'}
										type="submit"
										disabled={chosen.length === 0}
									>
										Přidat vybrané
									</Button>
								</Box>
							</Box>
						</Box>
					</Box>
				</form>
			</Box>
		</PopupContainer>
	)
}

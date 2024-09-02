'use client'
import PopupContainer from '@/common/components/Popup/PopupContainer'
import SelectFromOptions from '@/common/components/SongSelectPopup/components/SelectFromOptions'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { Box, Skeleton } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { VariantPackGuid } from '../../../interfaces/variant/songVariant.types'
import './styles.css'

type PopupProps = {
	onClose?: () => void
	open?: boolean
	onSubmit?: (packs: VariantPackGuid[]) => void

	anchorRef: React.RefObject<HTMLElement>
	anchorName: string
}

type ChosenSong = {
	guid: VariantPackGuid
	title: string
}

const CHOSEN_SONGS_HARDCODED: ChosenSong[] = [
	{
		guid: '0063f878-add7-499f-9e0b-c13cfae198e6' as VariantPackGuid,
		title: 'Píseň 1',
	},
	{
		guid: '008f7f69-b86f-4231-a45a-93401bbca890' as VariantPackGuid,
		title: 'Píseň 2',
	},
]

export default function SongSelectPopup(props: PopupProps) {
	const chosen: ChosenSong[] = CHOSEN_SONGS_HARDCODED

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		props.onClose?.()
		props.onSubmit?.(chosen.map((c) => c.guid))
		e.preventDefault()
	}

	const popupRef = useRef(null)
	const [position, setPosition] = useState<{
		top: number
		left?: number
		right?: number
	}>({ top: 0, left: 0 })

	const MAX_WIDTH = 500

	useEffect(() => {
		const OFFSET = 8
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
				onClick={props.onClose}
			>
				<form onSubmit={onSubmit}>
					<Box
						ref={popupRef}
						// className={'song-select-popup '}
						sx={{
							bgcolor: 'grey.200',
							maxWidth: MAX_WIDTH,
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
								<Typography variant="h4" strong>
									Vyberte píseň
								</Typography>
								<SelectFromOptions />
							</Box>

							<Box
								display={'flex'}
								flexDirection={'row'}
								overflow={'hidden'}
								gap={1}
							>
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton
										key={i}
										variant="rectangular"
										width={200}
										height={180}
										sx={{
											minWidth: 200,
										}}
									/>
								))}
							</Box>

							<Box>
								<Box>
									<Typography strong>Vybrané písně</Typography>
									<Typography>
										{chosen.map((c) => c.title).join(', ')}
									</Typography>
								</Box>
								<Box display={'flex'} justifyContent={'end'}>
									<Button color={'primarygradient'} type="submit">
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

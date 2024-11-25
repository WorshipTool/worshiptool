'use client'
import Popup from '@/common/components/Popup/Popup'
import { Box } from '@/common/ui/Box'
import { Button } from '@/common/ui/Button'
import { CircularProgress } from '@/common/ui/CircularProgress'
import { LinkBlockerPopupData } from '@/common/ui/Link/useOutsideBlocker'
import { Typography } from '@/common/ui/Typography'
import { useEffect, useState } from 'react'

type BlockLinkPopupProps = {
	open: boolean
	onClose?: () => void
	data: LinkBlockerPopupData
	redirecting: boolean
	onSubmit: () => void
}

const TIME_INTERVAL = 10
export default function BlockLinkPopup(props: BlockLinkPopupProps) {
	const [seconds, setSeconds] = useState(TIME_INTERVAL)

	useEffect(() => {
		if (!props.open) {
			setSeconds(TIME_INTERVAL)
			return
		}

		if (seconds > 0) {
			const interval = setInterval(() => {
				setSeconds(seconds - 1)
			}, 1000)
			return () => clearInterval(interval)
		}
	}, [props.open, seconds])

	useEffect(() => {
		if (seconds === 0) {
			props.onSubmit()
		}
	}, [seconds])

	return (
		<Popup
			open={props.open}
			onClose={props.onClose}
			// title={props.data.title}
			// subtitle={props.data.message}
			onSubmit={props.onSubmit}
			width={400}
			actions={[
				<Button
					key={'cancel'}
					type="reset"
					variant="text"
					color="grey.700"
					disabled={props.redirecting}
				>
					Zrušit
				</Button>,
				<Button key={'continue'} type="submit" loading={props.redirecting}>
					Pokračovat
				</Button>,
			]}
		>
			<Box
				display={'flex'}
				gap={1}
				// alignItems={'center'}
				justifyContent={'space-between'}
			>
				<Box display={'flex'} flexDirection={'column'}>
					<Typography variant="h5" strong>
						{props.data.title}
					</Typography>
					<Typography color="grey.600">{props.data.message}</Typography>
				</Box>

				<Box sx={{ position: 'relative' }}>
					<CircularProgress
						variant="determinate"
						value={100 - (seconds / (TIME_INTERVAL + 1)) * 100}
					/>
					<Box
						sx={{
							top: 0,
							left: 0,
							right: 0,
							aspectRatio: 1,
							position: 'absolute',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography>{seconds}</Typography>
					</Box>
				</Box>
				{/* <Typography strong>{seconds}</Typography> */}
				{/* <Box flex={1} />
				<Button variant="text" onClick={props.onSubmit} color="grey.700">
					Hned
				</Button>
				<Button onClick={props.onClose}>Zrušit</Button> */}
			</Box>
		</Popup>
	)
}

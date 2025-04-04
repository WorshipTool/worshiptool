'use client'
import AllListPanel from '@/app/components/components/AllListPanel/AllListPanel'
import LastAddedPanel from '@/app/components/components/LastAddedPanel/LastAddedPanel'
import { useFlag } from '@/common/providers/FeatureFlags/useFlag'
import { Box, Image, Typography } from '@/common/ui'
import { getAssetUrl } from '@/tech/paths.tech'

export default function RightSheepPanel() {
	const sheepSize = 140
	const showLastAdded = useFlag('show_last_added_songs')
	return (
		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					top: '-110px',
					right: '10%',
					zIndex: -1,
				}}
			>
				<Image
					src={getAssetUrl('/sheeps/ovce3.svg')}
					alt="Ovečka"
					width={sheepSize}
					height={sheepSize}
				/>
			</Box>
			{showLastAdded ? (
				<LastAddedPanel />
			) : (
				<Box
					sx={{
						bgcolor: 'grey.100',
						padding: 2,
						borderRadius: 2,
						maxWidth: 300,
					}}
				>
					<Typography variant="h5" strong>
						Nemáš nápad?
					</Typography>
					<Typography>
						Vyber si chválu z nápadů níže nebo ze seznamu všech písní
					</Typography>
				</Box>
			)}
			<AllListPanel />
		</Box>
	)
}

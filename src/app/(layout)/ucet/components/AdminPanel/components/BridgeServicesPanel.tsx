import {
	Box,
	Card,
	Clickable,
	IconButton,
	Tooltip,
	Typography,
} from '@/common/ui'
import { Chip } from '@/common/ui/mui'
import { useApi } from '@/hooks/api/useApi'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Lan, LastPage, Refresh } from '@mui/icons-material'

type BridgeServiceData = {
	id: string
	type: string
	name: string
	lastTickDate: any
	active: boolean
	external: boolean
}
export default function BridgeServicesPanel() {
	const { bridgeApi } = useApi()
	const [apiState, refresh] = useApiStateEffect<BridgeServiceData[]>(
		async () => {
			return handleApiCall(bridgeApi.bridgeControllerGetServices()) as any
		}
	)
	return (
		<Card
			title="Připojené programy"
			icon={<Lan />}
			sx={{ position: 'relative' }}
		>
			<Box
				sx={{
					position: 'absolute',
					right: 0,
					top: 0,
					padding: 1,
				}}
			>
				<IconButton size="small" disabled={apiState.loading} onClick={refresh}>
					<Refresh fontSize="small" />
				</IconButton>
			</Box>

			{apiState.data?.map((s) => {
				const lastTickDate = new Date(s.lastTickDate)
				const ago = Date.now() - lastTickDate.getTime()

				return (
					<Clickable key={s.id}>
						<Box
							key={s.id}
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								gap: 1,
								justifyContent: 'space-between',
								bgcolor: 'grey.100',
								padding: 1,
								borderRadius: 1,
							}}
						>
							<Box display={'flex'} alignItems={'center'} gap={2}>
								<Box
									sx={{
										width: '1rem',
										height: '1rem',
										borderRadius: '50%',
										bgcolor: s.active ? 'success.main' : 'error.main',
									}}
								/>
								<Box display={'flex'} alignItems={'center'} gap={1}>
									<Typography strong>{s.name}</Typography>
									<Chip size="small" label={s.type} disabled />
								</Box>
							</Box>
							<Box display={'flex'} alignItems={'center'} gap={1}>
								<Typography small>Před {Math.floor(ago / 1000)}s</Typography>
								{s.external && (
									<Tooltip title="Externí">
										<LastPage fontSize="small" />
									</Tooltip>
								)}
							</Box>
						</Box>
					</Clickable>
				)
			})}
		</Card>
	)
}

import { VariantPackAlias } from '@/api/dtos'
import { Button, CircularProgress, Tooltip, useTheme } from '@/common/ui'
import { ListItemIcon, ListItemText, MenuItem } from '@/common/ui/mui'
import { parseVariantAlias } from '@/routes/routes.tech'
import { EggAlt } from '@mui/icons-material'
import { PostCreateCopyOutDto } from '../../../../../../../api/generated'
import { useApi } from '../../../../../../../hooks/api/useApi'
import { useSmartNavigate } from '../../../../../../../routes/useSmartNavigate'
import { useApiState } from '../../../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../../../tech/handleApiCall'

export type CreateCopyButtonProps = {
	variantGuid: string
	asMenuItem?: boolean
}

export default function CreateCopyButton(props: CreateCopyButtonProps) {
	const { songAddingApi } = useApi()

	const { fetchApiState, apiState } = useApiState<PostCreateCopyOutDto>()
	const navigate = useSmartNavigate()

	const onClick = async () => {
		await fetchApiState(
			async () => {
				const result = await handleApiCall(
					songAddingApi.songAddingControllerCreateCopy({
						variantGuid: props.variantGuid,
					})
				)

				return result
			},
			(data) => {
				navigate('variant', {
					...parseVariantAlias(data.alias as VariantPackAlias),
				})
			}
		)
	}

	const theme = useTheme()

	return props.asMenuItem ? (
		<MenuItem onClick={onClick} disabled={apiState.loading}>
			<ListItemIcon>
				{apiState.loading ? (
					<CircularProgress size={`1rem`} color="inherit" />
				) : (
					<EggAlt color="inherit" />
				)}
			</ListItemIcon>
			<ListItemText primary="Vytvořit kopii" />
		</MenuItem>
	) : (
		<Tooltip title={'Vytvořit soukromou kopii písně'}>
			<Button
				color="success"
				variant="contained"
				startIcon={
					<EggAlt
						sx={{
							[theme.breakpoints.down('lg')]: {
								display: 'none',
							},
						}}
					/>
				}
				loading={apiState.loading}
				onClick={onClick}
			>
				Vytvořit úpravu
			</Button>
		</Tooltip>
	)
}

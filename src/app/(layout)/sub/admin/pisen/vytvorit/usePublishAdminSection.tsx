import { VariantPackAlias } from '@/api/dtos'
import { PostCreateVariantOutDto } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { AdminStepperItem } from '@/app/(layout)/sub/admin/pisen/vytvorit/page'
import { Button } from '@/common/ui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { Publish } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

export default function usePublishAdminSection(
	packData: PostCreateVariantOutDto
): AdminStepperItem {
	const { enqueueSnackbar } = useSnackbar()

	const navigate = useSmartNavigate()
	const api = useApi('songPublishingApi')

	const { fetchApiState, apiState } = useApiState<boolean>()

	const onClick = async () => {
		const result = await fetchApiState(() =>
			api.publishOfficialVariant({
				packGuid: packData.packGuid,
			})
		)
		console.log('Publishing result:', result)
		enqueueSnackbar('Píseň bylo úspěšně publikováno', {})
		navigate('adminPack', {
			...parseVariantAlias(packData.alias as VariantPackAlias),
		})
	}

	return {
		label: 'Zveřejnění',
		component: <div>Zveřejnění</div>,
		disabledContinue: apiState.loading,
		actions: (cont, disabledContinue) => (
			<Button
				disabled={disabledContinue}
				color="success"
				endIcon={<Publish />}
				onClick={onClick}
			>
				Zveřejnit
			</Button>
		),
	}
}

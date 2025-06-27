import { VariantPackAlias } from '@/api/dtos'
import { PostCreateVariantOutDto } from '@/api/generated'
import { AdminStepperItem } from '@/app/(layout)/sub/admin/pisen/vytvorit/page'
import { Button } from '@/common/ui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { Publish } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

export default function usePublishAdminSection(
	packData: PostCreateVariantOutDto
): AdminStepperItem {
	const { enqueueSnackbar } = useSnackbar()

	const navigate = useSmartNavigate()

	return {
		label: 'Zveřejnění',
		component: <div>Zveřejnění</div>,
		actions: (cont, disabledContinue) => (
			<Button
				disabled={disabledContinue}
				color="success"
				endIcon={<Publish />}
				onClick={() => {
					enqueueSnackbar('Zveřejnění písně zatím není implementováno', {})
					navigate('adminPack', {
						...parseVariantAlias(packData.alias as VariantPackAlias),
					})
				}}
			>
				Zveřejnit
			</Button>
		),
	}
}

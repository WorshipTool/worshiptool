import ShowPackFamilyOption from '@/app/(layout)/pisen/[hex]/[alias]/components/admin/ShowPackFamilyOption'
import { useInnerPackSong } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import AdminOption from '@/common/components/admin/AdminOption'
import OnlyAdmin from '@/common/components/admin/OnlyAdmin'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useSmartParams } from '@/routes/useSmartParams'
import { AdminPanelSettings } from '@mui/icons-material'

export default function AllSongAdminOptions() {
	const { variant } = useInnerPackSong()
	const prop = useSmartParams('variant')
	const navigate = useSmartNavigate()
	const goToAdmin = () => {
		navigate('adminPack', {
			hex: prop.hex,
			alias: prop.alias,
		})
	}
	return (
		<OnlyAdmin hideEnvelope>
			{/* <AdminOption
				label={variant.inFormat ? 'Správný formát' : 'Nevalidní formát'}
				icon={<DomainVerification />}
				onlyNotification
			/>

			<AdminOption
				label={variant.public ? 'Píseň je veřejná' : 'Soukromá píseň'}
				icon={variant.public ? <Public /> : <PublicOff />}
				onlyNotification
			/> */}

			<ShowPackFamilyOption />

			{/* <AdminAdvancedInfoOption /> */}

			<AdminOption
				label="Pokročilé možnosti"
				subtitle="Admin nastavení"
				onClick={goToAdmin}
				icon={<AdminPanelSettings />}
			/>
		</OnlyAdmin>
	)
}

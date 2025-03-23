import AdminAdvancedInfoOption from '@/app/(layout)/pisen/[hex]/[alias]/components/admin/AdminInfoOption'
import ShowPackFamilyOption from '@/app/(layout)/pisen/[hex]/[alias]/components/admin/ShowPackFamilyOption'
import { useInnerSong } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import AdminOption from '@/common/components/admin/AdminOption'
import OnlyAdmin from '@/common/components/admin/OnlyAdmin'
import useAuth from '@/hooks/auth/useAuth'
import { DomainVerification, Public, PublicOff } from '@mui/icons-material'

export default function AllSongAdminOptions() {
	const { variant } = useInnerSong()
	return (
		<OnlyAdmin>
			<AdminOption
				label={variant.inFormat ? 'Správný formát' : 'Nevalidní formát'}
				icon={<DomainVerification />}
				onlyNotification
			/>

			<AdminOption
				label={variant.public ? 'Píseň je veřejná' : 'Soukromá píseň'}
				icon={variant.public ? <Public /> : <PublicOff />}
				onlyNotification
			/>

			<ShowPackFamilyOption />

			<AdminAdvancedInfoOption />
		</OnlyAdmin>
	)
}

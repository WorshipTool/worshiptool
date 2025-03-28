import AdminBreadItem from '@/app/(layout)/sub/admin/components/AdminBreadItem'
import { LayoutProps } from '@/common/types'

export default function layout(props: LayoutProps) {
	return (
		<>
			<AdminBreadItem label="Vytvořit" to="adminCreateSong" toParams={{}} />
			{props.children}
		</>
	)
}

import SmartPortalMenuItem from '@/common/components/SmartPortalMenuItem/SmartPortalMenuItem'
import { useDownSize } from '@/common/hooks/useDownSize'
import { Button } from '@/common/ui'
import { ListItemIcon, ListItemText, MenuItem } from '@/common/ui/mui'
import { Edit, Save } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { isSheetDataValid } from '../../../../../../../tech/sheet.tech'

interface EditButtonProps {
	onClick?: (editable: boolean) => void
	inEditMode?: boolean
	loading?: boolean
	sheetData: string
	title: string
	asMenuItem?: boolean
	anyChange: boolean
}

export default function EditButton(props: EditButtonProps) {
	const { enqueueSnackbar } = useSnackbar()

	const onClick = async () => {
		if (props.inEditMode) {
			if (props.sheetData === '' || props.title === '') {
				enqueueSnackbar('Nelze uložit píseň s prázdným polem')
				return
			}
		}
		props.onClick?.(!props.inEditMode)
	}

	const isSmall = useDownSize('md')

	return props.asMenuItem ? (
		<>
			{!props.inEditMode && (
				<MenuItem onClick={onClick}>
					<ListItemIcon>
						<Edit />
					</ListItemIcon>
					<ListItemText primary="Upravit" />
				</MenuItem>
			)}
		</>
	) : !isSmall || props.inEditMode ? (
		<Button
			variant="contained"
			color={props.inEditMode ? 'info' : 'secondary'}
			startIcon={props.inEditMode ? <Save /> : <Edit />}
			loading={props.loading}
			// loadingIndicator="Ukládání..."
			disabled={
				(props.inEditMode && !props.anyChange) ||
				(props.inEditMode && !isSheetDataValid(props.sheetData))
			}
			onClick={onClick}
		>
			{props.inEditMode ? 'Uložit' : 'Upravit'}
		</Button>
	) : (
		<SmartPortalMenuItem title={'Upravit'} onClick={onClick} icon={<Edit />} />
	)
}

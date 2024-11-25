import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TeamCard/TeamCard'
import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { DriveFileRenameOutline, Save } from '@mui/icons-material'
import React from 'react'

type TeamEditableCardProps = {
	title: string
	children?: (inEditMode: boolean) => React.ReactNode
	onSave?: () => Promise<void>
	onCancel?: () => void
	editable?: boolean
}

export default function TeamEditableCard(props: TeamEditableCardProps) {
	const [inEditMode, setInEditMode] = React.useState(false)

	const [saving, setSaving] = React.useState(false)

	const save = () => {
		setSaving(true)
		props.onSave?.().then(() => {
			setSaving(false)
			setInEditMode(false)
		})
	}
	const cancel = () => {
		props.onCancel?.()
		setInEditMode(false)
	}
	return (
		<TeamCard>
			<Box
				display={'flex'}
				flexDirection={'row'}
				justifyContent={'space-between'}
				flexWrap={'wrap'}
			>
				<Typography variant="h6" strong>
					{props.title}
				</Typography>
				{props.editable && (
					<>
						{!inEditMode ? (
							<Button
								endIcon={<DriveFileRenameOutline />}
								variant="outlined"
								color="black"
								size="small"
								onClick={() => setInEditMode(true)}
							>
								Upravit
							</Button>
						) : (
							<Box display={'flex'} flexDirection={'row'} gap={1}>
								<Button
									size="small"
									onClick={cancel}
									color="grey.600"
									variant="text"
									disabled={saving}
								>
									Zrušit
								</Button>
								<Button
									size="small"
									onClick={save}
									endIcon={<Save />}
									// variant={'outlined'}
									loading={saving}
								>
									Uložit
								</Button>
							</Box>
						)}
					</>
				)}
			</Box>
			{props.children?.(inEditMode)}
		</TeamCard>
	)
}

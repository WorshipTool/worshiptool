import { RestartAlt } from '@mui/icons-material'
import {
	Button,
	Divider,
	LinearProgress,
	StepContent,
	StepLabel,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { SkeletonLoader } from '../../../../../../../common/providers/SkeletonLoader'
import { Gap } from '../../../../../../../common/ui/Gap/Gap'
import { usePermissions } from '../../../../../../../hooks/permissions/usePermissions'
import PermissionItem from './PermissionItem'

type SecondStepProps = {
	onReset: () => void
	userGuid: string
}

export default function SecondStep(props: SecondStepProps) {
	const permissions = usePermissions(props.userGuid)

	const [addingNew, setAddingNew] = useState(false)
	const onAddNew = () => {
		setAddingNew(true)
	}

	return (
		<>
			<StepLabel>2. Spravuj jeho práva</StepLabel>
			<StepContent>
				<SkeletonLoader
					data={[permissions.state]}
					renderLoading={() => {
						return <LinearProgress />
					}}
					render={() => (
						<>
							<Typography variant="subtitle2">
								Aktuální práva uživatele:
							</Typography>
							{permissions.permissions.length > 0 ? (
								<>
									{permissions.permissions.map((permission) => (
										<PermissionItem
											key={permission.guid}
											permission={permission}
											userGuid={props.userGuid}
											onSubmit={() => permissions.reload()}
										/>
									))}
								</>
							) : (
								<>
									<Typography>Uživatel nemá žádná speciální práva</Typography>
								</>
							)}

							{addingNew ? (
								<>
									<Divider />
									<PermissionItem
										permission={{
											type: 'GROUP_ADD_SONG',
											payload: '',
										}}
										editable
										onSubmit={() => {
											setAddingNew(false)
											permissions.reload()
										}}
										userGuid={props.userGuid}
									/>
									<Gap />
									<Button
										onClick={() => setAddingNew(false)}
										color="error"
										variant="contained"
										size="small"
									>
										Zrušit
									</Button>
								</>
							) : (
								<>
									<Button
										onClick={onAddNew}
										variant="contained"
										size="small"
										color="success"
									>
										Přidat nové
									</Button>
								</>
							)}
						</>
					)}
				/>

				<Gap />
				<Divider />
				<Gap />
				<Button
					onClick={props.onReset}
					startIcon={<RestartAlt />}
					variant="outlined"
					size="small"
				>
					Spravovat jiného uživatele
				</Button>
			</StepContent>
		</>
	)
}

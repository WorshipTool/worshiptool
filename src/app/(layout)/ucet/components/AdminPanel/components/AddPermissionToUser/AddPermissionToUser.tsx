import { SupervisedUserCircle } from '@mui/icons-material'
import { Step, Stepper } from '@mui/material'
import React from 'react'
import { Card } from '../../../../../../../common/ui/Card/Card'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

export default function AddPermissionToUser() {
	const [current, setCurrent] = React.useState(0)
	const [userGuid, setUserGuid] = React.useState<string>('')
	const onUserLoad = (userGuid: string) => {
		setUserGuid(userGuid)
		setCurrent(1)
	}

	const onReset = () => {
		setCurrent(0)
	}

	return (
		<Card
			icon={<SupervisedUserCircle />}
			title="Spravuj práva uživatele"
			sx={{ position: 'relative' }}
		>
			<Stepper orientation="vertical" activeStep={current}>
				<Step>
					<FirstStep onLoad={onUserLoad} active={current === 0} />
				</Step>
				<Step>
					<SecondStep onReset={onReset} userGuid={userGuid} />
				</Step>
			</Stepper>
		</Card>
	)
}

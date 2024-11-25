import { Typography } from '@/common/ui'
import { SheetStyleComponentType } from './config'

const ExperimentalStyle: SheetStyleComponentType = (props) => {
	return (
		<div>
			{props.title && <Typography variant="h4">{props.title}</Typography>}

			{props.sheet.getSections().map((section, index) => {
				return <Typography key={index}>{section.text}</Typography>
			})}
		</div>
	)
}

export default ExperimentalStyle

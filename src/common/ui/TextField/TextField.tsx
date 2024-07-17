import { InputBase, SxProps } from '@mui/material'

type TextFieldProps = {
	value?: string
	startValue?: string
	onChange?: (value: string) => void
	placeholder?: string
	sx?: SxProps<{}>
	className?: string
}

export default function TextField({
	placeholder = 'Zadejte text',
	...props
}: TextFieldProps) {
	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		props.onChange?.(event.target.value)
	}
	return (
		<InputBase
			placeholder={placeholder}
			value={props.value}
			defaultValue={props.startValue}
			onChange={onChangeHandler}
			className={props.className}
			sx={props.sx}
		/>
	)
}

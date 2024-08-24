import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import SearchIcon from '@mui/icons-material/Search'
import { Box, InputBase, styled, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

const SearchContainer = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.grey[100],
	padding: '0.5rem',
	paddingLeft: '0.8rem',
	paddingRight: '0.8rem',
	borderRadius: '0.5rem',
	display: 'flex',

	justifyContent: 'center',
	alignItems: 'center',
}))
const SearchInput = styled(InputBase)(({ theme }) => ({
	flex: 1,
	marginLeft: '0.5em',
	zIndex: 100,
}))

type MainSearchInputProps = {
	gradientBorder: boolean
	value: string
	onChange: (value: string) => void
}

export const MAIN_SEARCH_EVENT_NAME = 'search_event_5jh14'

export default function MainSearchInput(props: MainSearchInputProps) {
	const theme = useTheme()
	const inputRef = useRef<HTMLInputElement>()

	const [earlyFocused, setEarlyFocused] = useState(false)
	useChangeDelayer(
		earlyFocused,
		() => {
			setEarlyFocused(false)
		},
		[],
		1500
	)

	useEffect(() => {
		// This function is called only if its called from home page
		const handler = () => {
			window.scrollTo({
				top: 90,
				behavior: 'smooth',
			})
			setTimeout(() => {
				inputRef.current?.focus()
				setEarlyFocused(true)
			}, 200)
		}
		window.addEventListener(MAIN_SEARCH_EVENT_NAME, handler)
		return () => {
			window.removeEventListener(MAIN_SEARCH_EVENT_NAME, handler)
		}
	}, [])
	return (
		<div
			style={{
				background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
				boxShadow: `0px 3px 4px ${theme.palette.grey[500]}`,
				width: '100%',
				borderRadius: '0.6rem',
				padding: props.gradientBorder ? 2 : 0,
				transform: earlyFocused ? 'scale(107%)' : '',
				transition: 'all 0.3s ease',
			}}
		>
			<SearchContainer>
				<SearchIcon />
				<SearchInput
					placeholder="Hledej..."
					onChange={(e) => props.onChange(e.target.value)}
					autoFocus
					value={props.value}
					inputRef={inputRef}
				></SearchInput>
			</SearchContainer>
		</div>
	)
}

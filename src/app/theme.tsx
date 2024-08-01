import { createTheme } from '@mui/material'
import { ThemeProvider as TP } from '@mui/material/styles'
import { Roboto } from 'next/font/google'

const theme = createTheme({
	palette: {
		primary: {
			main: '#0085FF',
			dark: '#532EE7',
		},
		secondary: {
			main: '#EBBC1E',
		},
		success: {
			main: '#43a047',
		},
	},
})

const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
	display: 'swap',
})

type ThemeProviderProps = {
	children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	return (
		<TP theme={theme}>
			<div className={roboto.className}>{children}</div>
		</TP>
	)
}

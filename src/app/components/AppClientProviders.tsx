'use client'
import HotjarAnalytics from '@/app/components/components/HotjarAnalytics'
import { ThemeProvider } from '@/app/theme'
import ErrorHandlerProvider from '@/common/components/app/providers/ErrorHandlerProvider'
import { AuthProvider } from '@/hooks/auth/useAuth'
import { GroupProvider } from '@/hooks/group/useGroup'
import { PlaylistProvider } from '@/hooks/playlist/useCurrentPlaylist'
import { SnackbarProvider } from 'notistack'

type AppClientProvidersProps = {
	children?: React.ReactNode
}
export default function AppClientProviders({
	children,
}: AppClientProvidersProps) {
	return (
		<ThemeProvider>
			<SnackbarProvider
				maxSnack={1}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				autoHideDuration={3000}
			>
				{/* <BrowserRouter> */}
				<AuthProvider>
					<HotjarAnalytics />
					<ErrorHandlerProvider>
						<GroupProvider>
							<PlaylistProvider>{children}</PlaylistProvider>
						</GroupProvider>
					</ErrorHandlerProvider>
				</AuthProvider>
				{/* </BrowserRouter> */}
			</SnackbarProvider>
		</ThemeProvider>
	)
}

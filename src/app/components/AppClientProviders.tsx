'use client'
import { ThemeProvider } from '@/app/theme'
import { ToolbarProvider } from '@/common/components/Toolbar/hooks/useToolbar'
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
					<ErrorHandlerProvider>
						<GroupProvider>
							<ToolbarProvider>
								<PlaylistProvider>{children}</PlaylistProvider>
							</ToolbarProvider>
						</GroupProvider>
					</ErrorHandlerProvider>
				</AuthProvider>
				{/* </BrowserRouter> */}
			</SnackbarProvider>
		</ThemeProvider>
	)
}

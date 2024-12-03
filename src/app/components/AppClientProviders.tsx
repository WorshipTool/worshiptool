'use client'
import AppSongSelectSpecifierProvider from '@/app/components/components/AppSongSelectSpecifierProvider'
import { ThemeProvider } from '@/app/theme'
import { FooterProvider } from '@/common/components/Footer/hooks/useFooter'
import { ToolbarProvider } from '@/common/components/Toolbar/hooks/useToolbar'
import ErrorHandlerProvider from '@/common/components/app/providers/ErrorHandlerProvider'
import { AuthProvider } from '@/hooks/auth/useAuth'
import SongDragProvider from '@/hooks/dragsong/SongDragProvider'
import { GroupProvider } from '@/hooks/group/useGroup'
import { CurrentPlaylistProvider } from '@/hooks/playlist/useCurrentPlaylist'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SnackbarProvider } from 'notistack'

import StableTeamSubdomainProvider from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/Providers/StableTeamSubdomainProvider'
import { BottomPanelProvider } from '@/app/providers/BottomPanelProvider'
import { OutsideLinkBlockerProvider } from '@/common/ui/Link/useOutsideBlocker'
import { FavouritesProvider } from '@/hooks/favourites/useFavourites'
import { PermissionsProvider } from '@/hooks/permissions/usePermissions'
import { SubdomainPathnameAliasProvider } from '@/routes/subdomains/SubdomainPathnameAliasProvider'
import 'dayjs/locale/cs'
type AppClientProvidersProps = {
	children?: React.ReactNode
}
export default function AppClientProviders({
	children,
}: AppClientProvidersProps) {
	return (
		<ThemeProvider>
			<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
				<SnackbarProvider
					maxSnack={1}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					autoHideDuration={3000}
					preventDuplicate
				>
					{/* <BrowserRouter> */}
					<SubdomainPathnameAliasProvider>
						<AuthProvider>
							<PermissionsProvider>
								<ErrorHandlerProvider>
									<BottomPanelProvider>
										<FavouritesProvider>
											<GroupProvider>
												<ToolbarProvider>
													<FooterProvider>
														<OutsideLinkBlockerProvider>
															<StableTeamSubdomainProvider>
																<AppSongSelectSpecifierProvider>
																	<CurrentPlaylistProvider>
																		<SongDragProvider>
																			{children}
																		</SongDragProvider>
																	</CurrentPlaylistProvider>
																</AppSongSelectSpecifierProvider>
															</StableTeamSubdomainProvider>
														</OutsideLinkBlockerProvider>
													</FooterProvider>
												</ToolbarProvider>
											</GroupProvider>
										</FavouritesProvider>
									</BottomPanelProvider>
								</ErrorHandlerProvider>
							</PermissionsProvider>
						</AuthProvider>
					</SubdomainPathnameAliasProvider>
					{/* </BrowserRouter> */}
				</SnackbarProvider>
			</LocalizationProvider>
		</ThemeProvider>
	)
}

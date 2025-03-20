'use client'
import AppSongSelectSpecifierProvider from '@/app/components/components/AppSongSelectSpecifierProvider'
import { FooterProvider } from '@/common/components/Footer/hooks/useFooter'
import { ToolbarProvider } from '@/common/components/Toolbar/hooks/useToolbar'
import ErrorHandlerProvider from '@/common/components/app/providers/ErrorHandlerProvider'
import { AuthProvider } from '@/hooks/auth/useAuth'
import SongDragProvider from '@/hooks/dragsong/SongDragProvider'
import { CurrentPlaylistProvider } from '@/hooks/playlist/useCurrentPlaylist'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SnackbarProvider } from 'notistack'

import StableTeamSubdomainProvider from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/Providers/StableTeamSubdomainProvider'
import { BottomPanelProvider } from '@/app/providers/BottomPanelProvider'
import { FeatureFlagsProvider } from '@/common/providers/FeatureFlags'
import { OutsideLinkBlockerProvider } from '@/common/ui/Link/useOutsideBlocker'
import { TranslationLikesProvider } from '@/common/ui/SongCard/hooks/useTranslationsLikes'
import { AllCommonData } from '@/hooks/common-data/common-data.types'
import { CommonDataProvider } from '@/hooks/common-data/useCommonData'
import { FavouritesProvider } from '@/hooks/favourites/useFavourites'
import { PermissionsProvider } from '@/hooks/permissions/usePermissions'
import { SubdomainPathnameAliasProvider } from '@/routes/subdomains/SubdomainPathnameAliasProvider'
import 'dayjs/locale/cs'
type AppClientProvidersProps = {
	initialCommonData: AllCommonData
	children?: React.ReactNode
}
export default function AppClientProviders({
	children,
	initialCommonData,
}: AppClientProvidersProps) {
	return (
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
						<FeatureFlagsProvider>
							<PermissionsProvider>
								<ErrorHandlerProvider>
									<CommonDataProvider initialData={initialCommonData}>
										<TranslationLikesProvider>
											<BottomPanelProvider>
												<FavouritesProvider>
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
												</FavouritesProvider>
											</BottomPanelProvider>
										</TranslationLikesProvider>
									</CommonDataProvider>
								</ErrorHandlerProvider>
							</PermissionsProvider>
						</FeatureFlagsProvider>
					</AuthProvider>
				</SubdomainPathnameAliasProvider>
				{/* </BrowserRouter> */}
			</SnackbarProvider>
		</LocalizationProvider>
	)
}

'use client'

import GoogleLoginButton from '@/app/(nolayout)/(background)/prihlaseni/components/GoogleLoginButton'
import SvgIcon from '@/assets/icon.svg'
import { Box, Typography } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { TextInput } from '@/common/ui/TextInput'
import { useTranslations } from 'next-intl'

type LoginMobileProps = {
	email: string
	password: string
	onEmailChange: (value: string) => void
	onPasswordChange: (value: string) => void
	isEmailOk: boolean
	isPasswordOk: boolean
	inProgress: boolean
	errorMessage: string
	message?: string
	previousPage?: string
	onSubmit: () => void
	onForgotPassword: () => void
	onGoogleLogin: () => void
}

/**
 * Native-feeling mobile login on the app's grey canvas (the shared wool
 * background shows through). The brand mark and welcome sit at the top,
 * full-width inputs and a full-width primary CTA follow, and the sign-up link
 * is docked at the bottom. The desktop card layout stays in page.tsx; this
 * component owns the phone view.
 */
export default function LoginMobile(props: LoginMobileProps) {
	const t = useTranslations('auth.login')
	const tCommon = useTranslations('common')

	return (
		<Box
			sx={{
				width: '100%',
				boxSizing: 'border-box',
				minHeight: '100dvh',
				display: 'flex',
				flexDirection: 'column',
				paddingX: 3,
				paddingTop: 'calc(env(safe-area-inset-top) + 48px)',
				paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
			}}
		>
			{/* brand: plain logo mark + welcome */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 1.5,
				}}
			>
				<Box sx={{ color: 'grey.900', display: 'flex' }}>
					<SvgIcon height={52} />
				</Box>
				<Typography variant="h4" strong={800} align="center">
					{t('title')}
				</Typography>
				<Typography color="grey.600" align="center">
					{props.message || t('subtitle')}
				</Typography>
			</Box>

			{/* form, sitting just below the brand */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2.5,
					marginTop: 5,
				}}
			>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<GoogleLoginButton afterLogin={props.onGoogleLogin} />
				</Box>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
					}}
				>
					<Box sx={{ flex: 1, height: '1px', bgcolor: 'grey.400' }} />
					<Typography small color="grey.600">
						{tCommon('or')}
					</Typography>
					<Box sx={{ flex: 1, height: '1px', bgcolor: 'grey.400' }} />
				</Box>

				{props.errorMessage !== '' && (
					<Typography color="error" align="center" small>
						{props.errorMessage}
					</Typography>
				)}

				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault()
						props.onSubmit()
					}}
					sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
				>
					<TextInput
						title={t('email')}
						value={props.email}
						onChange={props.onEmailChange}
						error={!props.isEmailOk}
						disabled={props.inProgress}
						type="email"
						placeholder={t('enterEmail')}
						required
						sx={{ bgcolor: 'background.paper' }}
					/>
					<TextInput
						title={t('password')}
						value={props.password}
						onChange={props.onPasswordChange}
						error={!props.isPasswordOk}
						disabled={props.inProgress}
						type="password"
						placeholder={t('enterPassword')}
						required
						sx={{ bgcolor: 'background.paper' }}
					/>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: -1 }}>
						<Button
							size="small"
							variant="text"
							color="grey.600"
							onClick={props.onForgotPassword}
						>
							{t('forgotPassword')}
						</Button>
					</Box>
					<Button
						type="submit"
						loading={props.inProgress}
						variant="contained"
						color="primarygradient"
						size="large"
						sx={{ width: '100%' }}
					>
						{t('loginButton')}
					</Button>
				</Box>
			</Box>

			{/* push the sign-up link to the bottom of the screen */}
			<Box sx={{ flex: 1, minHeight: 24 }} />

			{/* footer: sign-up link docked at the bottom */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Typography size={'0.9rem'} color="grey.700">
					{t('noAccount')}
				</Typography>
				<Button
					size="small"
					variant="text"
					to="signup"
					toParams={{ previousPage: props.previousPage }}
				>
					{t('createAccount')}
				</Button>
			</Box>
		</Box>
	)
}

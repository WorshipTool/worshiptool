'use client'

import GoogleLoginButton from '@/app/(nolayout)/(background)/prihlaseni/components/GoogleLoginButton'
import SvgIcon from '@/assets/icon.svg'
import { Box, Typography, useTheme } from '@/common/ui'
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
 * Native-feeling mobile login: a full-screen white sheet (no small floating
 * card on the wool gradient), a gradient app-icon badge, full-width inputs and
 * a full-width primary CTA. The brand sits at the top, the form is centred in
 * the remaining space and the sign-up link is docked at the bottom. The desktop
 * card layout stays in page.tsx; this component owns the phone view.
 */
export default function LoginMobile(props: LoginMobileProps) {
	const theme = useTheme()
	const t = useTranslations('auth.login')
	const tCommon = useTranslations('common')

	return (
		<Box
			sx={{
				width: '100%',
				boxSizing: 'border-box',
				minHeight: '100dvh',
				bgcolor: 'background.paper',
				display: 'flex',
				flexDirection: 'column',
				paddingX: 3,
				paddingTop: 'calc(env(safe-area-inset-top) + 48px)',
				paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
			}}
		>
			{/* brand: gradient app-icon badge + welcome, mirroring the topbar's blue */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 1.5,
				}}
			>
				<Box
					sx={{
						width: 64,
						height: 64,
						borderRadius: 3,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
						boxShadow: 3,
					}}
				>
					<SvgIcon fill="white" height={34} />
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
						position: 'relative',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							height: '1px',
							width: '100%',
							bgcolor: 'grey.200',
						}}
					/>
					<Typography
						sx={{ bgcolor: 'background.paper', paddingX: 1.5, zIndex: 1 }}
						small
						color="grey.500"
					>
						{tCommon('or')}
					</Typography>
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

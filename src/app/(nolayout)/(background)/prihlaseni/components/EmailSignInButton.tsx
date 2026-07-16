'use client'

import { Box } from '@/common/ui'
import { MailOutlineRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

type EmailSignInButtonProps = {
	onClick: () => void
}

/**
 * "Continue with e-mail" button styled to match the Google sign-in button
 * (white, hairline grey border, icon + sentence-case label, same 300px width)
 * so the two sign-in options read as a matching pair.
 */
export default function EmailSignInButton({ onClick }: EmailSignInButtonProps) {
	const t = useTranslations('auth.login')

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center' }}>
			<Box
				component="button"
				type="button"
				onClick={onClick}
				sx={{
					width: 300,
					maxWidth: '100%',
					minHeight: 40,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 1.25,
					paddingX: 2,
					bgcolor: 'background.paper',
					color: 'grey.800',
					border: '1px solid',
					borderColor: 'grey.300',
					borderRadius: 1,
					boxShadow: 1,
					fontFamily: 'inherit',
					fontSize: '0.95rem',
					fontWeight: 500,
					cursor: 'pointer',
					transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
					'&:hover': { bgcolor: 'grey.100', boxShadow: 2 },
					'&:active': { bgcolor: 'grey.200' },
				}}
			>
				<MailOutlineRounded sx={{ fontSize: 20, color: 'grey.700' }} />
				{t('continueWithEmail')}
			</Box>
		</Box>
	)
}

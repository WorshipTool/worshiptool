import { useFooter } from '@/common/components/Footer/hooks/useFooter'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { Favorite } from '@mui/icons-material'
import { Box } from '@mui/material'

import { MAIN_SEARCH_EVENT_NAME } from '@/app/components/components/MainSearchInput'
import { Gap } from '@/common/ui/Gap'
import { useSmartMatch } from '@/routes/useSmartMatch'
import { useSmartParams } from '@/routes/useSmartParams'
import { ComponentProps, useMemo } from 'react'
import './footer.styles.css'

type Links = [
	ComponentProps<typeof Button<'home'>>,
	ComponentProps<typeof Button<'songsList'>>,
	ComponentProps<typeof Button<'about'>>,
	ComponentProps<typeof Button<'teams'>>,
	ComponentProps<typeof Button<'contact'>>,
	ComponentProps<typeof Button<'contact'>>,
	ComponentProps<typeof Button<'contact'>>
]
export default function Footer() {
	const { hledat: searchString } = useSmartParams('home')
	const isHome = useSmartMatch('home')

	const links: Links = useMemo(
		() => [
			{
				children: 'Hledat píseň',
				to: 'home',
				toParams: { hledat: isHome ? searchString : '' },
				onClick: () => {
					window.dispatchEvent(new Event(MAIN_SEARCH_EVENT_NAME))
				},
			},
			{
				children: 'Seznam písní',
				to: 'songsList',
			},
			{
				children: 'O aplikaci',
				to: 'about',
			},
			{
				children: 'Týmy',
				to: 'teams',
			},
			{
				children: 'Zpětná vazba',
				to: 'contact',
			},
			{
				children: 'Nahlásit chybu',
				to: 'contact',
			},
			{
				children: 'Kontakt',
				to: 'contact',
			},
		],
		[isHome, searchString]
	)

	const footer = useFooter()

	return (
		<footer className={footer.show ? 'footer footer-open ' : 'footer'}>
			<Box
				sx={{
					bgcolor: 'grey.200',
					borderTop: '2px solid',
					borderColor: 'grey.300',
					marginTop: 1,
					padding: 1,
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				<Gap value={0.5} />
				<Box display={'flex'} flexDirection={'row'} gap={1}>
					{links.map((link) => {
						return (
							<Button
								size={'small'}
								key={link.children}
								color="grey.500"
								variant="text"
								sx={{
									fontWeight: 400,
								}}
								{...link}
							/>
						)
					})}
				</Box>
				<Box display={'flex'} flexDirection={'row'} gap={1}>
					<Typography strong size={'small'}>
						Vytvořeno s{' '}
						<Favorite
							color={'error'}
							sx={{
								fontSize: '0.9rem',
								transform: 'translateY(0.15rem)',
							}}
						/>
					</Typography>
					<Typography size={'small'}>2024</Typography>
					<Typography size={'small'}>© Všechna práva vyhrazena</Typography>
				</Box>
			</Box>
		</footer>
	)
}

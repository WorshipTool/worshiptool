import { useFooter } from '@/common/components/Footer/hooks/useFooter'
import { Box } from '@/common/ui'
import { Button, ButtonProps } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { Favorite } from '@mui/icons-material'

import { MAIN_SEARCH_EVENT_NAME } from '@/app/components/components/MainSearchInput'
import { useCloudNumber } from '@/common/providers/FeatureFlags/useCloudNumber'
import { Gap } from '@/common/ui/Gap'
import { Link } from '@/common/ui/Link/Link'
import { useSmartMatch } from '@/routes/useSmartMatch'
import { useSmartParams } from '@/routes/useSmartParams'
import { getAssetUrl } from '@/tech/paths.tech'
import Image from 'next/image'
import { useMemo } from 'react'
import './footer.styles.css'

type Links = [
	ButtonProps<'home'>,
	ButtonProps<'songsList'>,
	ButtonProps<'about'>,
	ButtonProps<'teams'>,
	ButtonProps<'contact'>,
	ButtonProps<'contact'>,
	ButtonProps<'contact'>
]
export default function Footer() {
	const { hledat: searchString } = useSmartParams('home')
	const isHome = useSmartMatch('home')

	const { value: year } = useCloudNumber('year', 2024)

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
				<Gap value={1} />
				<Link href={'https://worshipko.com' as any} target="_blank" external>
					<Box
						display={'flex'}
						flexDirection={'row'}
						gap={1}
						alignItems={'center'}
						// bgcolor={'grey.300'}
						sx={{
							borderRadius: 5,
							paddingX: 2,
							// border: '1px solid',
							borderColor: 'grey.400',
							paddingY: 0.5,
						}}
					>
						<Typography small color="grey.500">
							Ve spolupráci s
						</Typography>
						<Image
							src={getAssetUrl('worshipko.png')}
							alt={'Logo worshipko.com'}
							width={150}
							height={30}
							style={{
								objectFit: 'contain',
							}}
						/>
					</Box>
				</Link>
				<Gap value={1} />
				<Box
					display={'flex'}
					flexDirection={'row'}
					gap={{
						sm: 0,
						md: 1,
					}}
					flexWrap={'wrap'}
					justifyContent={'center'}
				>
					{links.map((link) => {
						return (
							<Button
								size={'small'}
								key={link.children as string}
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
				<Gap value={0.5} />

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
					<Typography size={'small'}>{year}</Typography>
					<Typography size={'small'}>© Všechna práva vyhrazena</Typography>
				</Box>
				<Gap value={2} />
			</Box>
		</footer>
	)
}

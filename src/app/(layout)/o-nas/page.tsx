import SectionLabelPill from '@/app/(layout)/o-nas/components/SectionLabelPill'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import './about.styles.css'

import Image from 'next/image'

import AboutInfoCard from '@/app/(layout)/o-nas/components/AboutInfoCard'
import AboutToolCard from '@/app/(layout)/o-nas/components/AboutToolCard'
import More from '@/app/(layout)/o-nas/components/More/More'
import ToolbarChanger from '@/app/(layout)/o-nas/components/ToolbarChanger'
import { Button } from '@/common/ui/Button'
import {
	DynamicFeed,
	Groups2,
	LibraryMusic,
	SmartButton,
	Source,
	Today,
} from '@mui/icons-material'
import Shape from './shape.svg'
import Shape2 from './shape2.svg'
export default SmartPage(Page, ['transparentToolbar'])

function Page() {
	return (
		<Box>
			<ToolbarChanger />

			{/* FIRST PAGE - Introduction */}
			<Box
				height={'calc(100vh - 56px)'}
				position={'relative'}
				display={'flex'}
				flexDirection={'column'}
				justifyContent={'center'}
			>
				<Box display={'flex'} flexDirection={'column'} gap={1}>
					<Box display={'flex'} flexDirection={'column'} gap={1}>
						<Box display={'flex'}>
							<SectionLabelPill label="Kdo jsme?" />
						</Box>
						<Box display={'flex'} flexDirection={'column'} fontSize={'4rem'}>
							<Typography size={'inherit'} strong className="about-title">
								Platforma
							</Typography>
							<Typography size={'inherit'} className="about-title">
								s křesťanskými
							</Typography>
							<Typography size={'inherit'} className="about-title">
								chválami
							</Typography>
						</Box>
					</Box>

					<Typography
						sx={{
							width: 400,
						}}
						size={'2rem'}
						strong={400}
						color="grey.500"
					>
						Jsme uživatelsky přívětivá platforma, která nabízí široký výběr
						chval a moderní nástroje
					</Typography>
					<Box display={'flex'}>
						<Button color="primarygradient">Dozvědět se víc</Button>
					</Box>
				</Box>
				<Gap value={8} />

				<Box>
					<Box
						sx={{
							position: 'absolute',
							top: -300,
							left: '55%',
							transform: 'scale(0.8) scaleX(1.2)',
						}}
					>
						<Shape2 />
					</Box>
					<Box
						sx={{
							position: 'absolute',
							top: -500,
							left: '65%',
							transform: 'scale(0.8) scaleX(1.2)',
						}}
					>
						<Shape />
					</Box>
				</Box>

				<Box
					sx={{
						position: 'absolute',
						bottom: 0,
						right: '25%',
						zIndex: 1,
					}}
				>
					<Image
						src={'/assets/ovce1.svg'}
						alt="Ovce"
						width={200}
						height={300}
						style={{
							transform: 'translateY(15px)',
						}}
					/>
				</Box>

				<Box
					sx={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: 45,
					}}
				>
					<More />
				</Box>
			</Box>

			{/* SECOND PAGE - Database */}
			<Box paddingX={4} position={'relative'} bgcolor={'grey.300'}>
				<Gap value={6} />
				<Box
					sx={{
						padding: 2,
						color: 'white',
						position: 'relative',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Box
						bgcolor={'grey.800'}
						sx={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: 0,
							height: '10rem',
							borderRadius: 4,
						}}
					/>
					<Box
						zIndex={1}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
						gap={2}
					>
						<Box
							display={'flex'}
							flexDirection={'row'}
							fontSize={'2rem'}
							gap={1}
						>
							<Typography size={'inherit'} strong={500}>
								Velká a aktuální
							</Typography>
							<Typography size={'inherit'} color="secondary" strong={500}>
								databáze
							</Typography>
						</Box>
						<Box
							display={'flex'}
							flexDirection={'row'}
							gap={2}
							width={'100%'}
							justifyContent={'space-around'}
						>
							<AboutInfoCard
								icon={<DynamicFeed />}
								title="Různé zdroje"
								text="Seskupujeme písně z jiných zpěvníků, abyste mohli hledat na jednom místě"
							/>
							<AboutInfoCard
								icon={<Today />}
								title="Aktuálnost"
								text="Abychom mohli nabídnout i nové písně, vyvinuli jsme chytrý algoritmus"
							/>
							<AboutInfoCard
								icon={<Source />}
								title="Váš zdroj"
								text="Nechte si nahrát písně ve vašem úložišti sem a používejte naše nástroje"
							/>
						</Box>
					</Box>
				</Box>

				<Gap value={6} />
				<Box>
					<Box display={'flex'} flexDirection={'row'} gap={1} fontSize={'2rem'}>
						<Typography size={'inherit'} strong>
							Synchronizace s
						</Typography>
						<Typography color="primary" size={'inherit'} strong>
							Google Drive
						</Typography>
					</Box>
					<Typography>
						Pokud máte například svůj seznam chval uložených na google drive,
						snadno napojte toto úložiště s naší databází. Všechny chvály, které
						budete mít na Googlu, vám budeme synchronizovat sem, do vašeho
						soukromého playlistu. Snadno pak například můžete chvály
						transponovat, čehož byste na googlu docílili těžko
					</Typography>
				</Box>
				<Gap value={6} />
			</Box>

			{/* THIRD PAGE - Tools */}
			<Box paddingX={4} paddingY={6} position={'relative'}>
				<Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
					<Typography size={'2rem'} strong>
						Nabízíme moderní nástroje
					</Typography>
					<Typography>Nejsme jen další křesťanský zpěvník</Typography>
				</Box>

				<Gap value={2} />
				<Box display={'flex'} flexDirection={'row'} gap={2}>
					<AboutToolCard
						title="Chytré vyhledávání"
						text="Najděte své písně podle jejich textu, tématu či dokonce nálady"
						icon={<SmartButton />}
						button={
							<Button size="small" variant="outlined" to="home">
								Vyzkoušet
							</Button>
						}
					/>
					<AboutToolCard
						title="Týmy"
						text="Sestavte si pro váš chválící tým prostředí, kde se snadno připravíte na společné hraní"
						icon={<Groups2 />}
						button={
							<Button
								variant="contained"
								// size="small"
								color="primarygradient"
								to="teams"
							>
								Dozvědět se víc
							</Button>
						}
					/>

					<AboutToolCard
						title="Tvorba playlistů"
						text="Vytvořte si z písní vlastní playlist, který lze snadno sdílet s ostatními"
						icon={<LibraryMusic />}
						button={
							<Button size="small" variant="outlined" to="usersPlaylists">
								Vyzkoušet
							</Button>
						}
					/>
				</Box>
			</Box>
		</Box>
	)
}

'use server'
import SectionLabelPill from '@/app/(layout)/o-nas/components/SectionLabelPill'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box } from '@/common/ui'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'

import Image from 'next/image'

import AboutInfoDatabase from '@/app/(layout)/o-nas/components/AboutInfoCard'
import AboutToolCard from '@/app/(layout)/o-nas/components/AboutToolCard'
import More from '@/app/(layout)/o-nas/components/More/More'
import MoreButton from '@/app/(layout)/o-nas/components/More/MoreButton'
import ToolbarChanger from '@/app/(layout)/o-nas/components/ToolbarChanger'
import { Video } from '@/common/components/Video/Video'
import { Button } from '@/common/ui/Button'
import { Groups2, LibraryMusic, SmartButton } from '@mui/icons-material'
import Shape from './shape.svg'
import Shape2 from './shape2.svg'

//TODO: fix overflow in better way.
import CollaborationWithWorshipkoCard from '@/app/(layout)/o-nas/components/CollaborationWithWorshipkoCard'
import HelpUsPanel from '@/app/(layout)/o-nas/components/HelpUsPanel'
import SheepBigGraphics from '@/app/(layout)/o-nas/components/SheepBigGraphics'
import { Divider } from '@/common/ui'
import breakpoints from '@/tech/theme/theme.tech'
import './styles.css'

export default SmartPage(Page, ['transparentToolbar', 'containLayout'])

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
				<Box
					display={'flex'}
					flexDirection={'column'}
					gap={3}
					sx={{
						paddingLeft: { xs: 0, lg: 10 },
					}}
				>
					<Box display={'flex'} flexDirection={'column'} gap={1}>
						<Box display={'flex'}>
							<SectionLabelPill label="Kdo jsme?" />
						</Box>
						<Box display={'flex'} flexDirection={'column'}>
							<Typography className="about-title" variant="h1" strong={600}>
								Platforma
							</Typography>
							<Typography className="about-title" variant="h1">
								s křesťanskými
							</Typography>
							<Typography className="about-title" variant="h1">
								chválami
							</Typography>
						</Box>
					</Box>
					<Typography
						sx={{
							maxWidth: 410,
						}}
						// strong={400}
						color="grey.500"
						variant="h3"
					>
						Jsme uživatelsky přívětivá platforma, která nabízí široký výběr
						chval ale především moderní nástroje
					</Typography>
					<Box display={'flex'}>
						<MoreButton />
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
						width: 'clamp(0px,25%, 180px)',
						aspectRatio: '1/2',
						transform: 'translateX(50%)',
					}}
				>
					<Image
						src={'/assets/sheeps/ovce1.svg'}
						alt="Ovce"
						fill
						style={{
							transform: 'translateY(15%)',
						}}
					/>
				</Box>

				<Box
					sx={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: 55,
					}}
				>
					<More />
				</Box>
			</Box>

			{/* <Divider /> */}
			{/* <Gap /> */}
			<CollaborationWithWorshipkoCard />
			{/* SECOND PAGE - Database */}
			<Box
				paddingY={8}
				position={'relative'}
				display={'flex'}
				flexDirection={'row'}
				gap={3}
				flexWrap={'wrap'}
			>
				<Box
					display={'flex'}
					flexDirection={'column'}
					gap={4}
					flex={1}
					minWidth={300}
				>
					<Box display={'flex'} flexDirection={'column'} gap={1}>
						<Typography variant="h2">Velká a aktuální databáze</Typography>

						<Typography
							variant="h4"
							sx={{
								maxWidth: 450,
							}}
							color="grey.500"
						>
							Základem celé aplikace je seznam chval. Tento seznam se snažíme
							držet co největší a dobře strukturovaný.
						</Typography>
					</Box>
					<Box
						flex={1}
						display={{
							xs: 'none',

							sm: 'flex',
						}}
						justifyContent={'center'}
						sx={{
							[breakpoints.up('lg')]: {
								transform: 'translateX(-64px) ',
							},
						}}
					>
						<SheepBigGraphics />
					</Box>
				</Box>
				<Box
					flex={1}
					display={'flex'}
					flexDirection={'column'}
					gap={4}
					minWidth={350}
					sx={{
						alignItems: 'center',
						[breakpoints.up('lg')]: {
							alignItems: 'end',
						},
					}}
					// bgcolor={'grey.500'}
				>
					<Box
						sx={{
							[breakpoints.up('lg')]: {
								transform: 'translateX(-128px) translateY(32px)',
							},
						}}
					>
						<AboutInfoDatabase
							order={0}
							title="Vše na jednom místě"
							text="Seskupujeme písně z jiných zpěvníků, abyste mohli hledat na jednom místě"
						/>
					</Box>
					<Box
						sx={{
							[breakpoints.up('lg')]: {
								transform: 'translateX(0%) translateY(32px)',
							},
						}}
					>
						<AboutInfoDatabase
							order={1}
							title="Neustálá aktualizace"
							text="Náš algoritmus automaticky 
                                        přidává nové písně, takže databáze 
                                        je vždy aktuální"
						/>
					</Box>
					<Box
						sx={{
							[breakpoints.up('lg')]: {
								transform: `translateX(-100%) translateX(-32px) translateY(-32px)`,
							},
						}}
					>
						<AboutInfoDatabase
							order={2}
							title="Váše písně"
							text="Databáze je otevřená 
                                        - sami můžete přidávat chvály, veřejně či soukromě"
						/>
					</Box>
				</Box>
			</Box>

			{/* <Divider /> */}
			<Divider />

			{/* THIRD PAGE - Tools */}
			<Box paddingX={4} paddingY={6} position={'relative'}>
				<Box
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					gap={1}
				>
					<Typography variant="h2">Nástroje</Typography>
					<Typography variant="h4" color="grey.600" align="center">
						Zdarma nabízíme nástroje, které se vám můžou hodit
					</Typography>
				</Box>

				<Gap value={2} />
				<Box display={'flex'} flexDirection={'row'} gap={2} flexWrap={'wrap'}>
					<AboutToolCard
						title="Chytré vyhledávání"
						text="Najděte své písně podle jejich názvu nebo i textu"
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
								size="small"
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

			<Divider />
			{/* FOURTH PAGE - Video */}

			<Box paddingY={8} position={'relative'} display={'none'}>
				<Box display={'flex'} flexDirection={'row'} gap={2} flexWrap={'wrap'}>
					<Box display={'flex'} flexDirection={'column'} flex={2} gap={1}>
						<Typography variant="h2" noWrap>
							Proč, kdo a jak?
						</Typography>
						<Typography variant="h4" color="grey.600">
							Celý projekt byl vytvořen z nějakého důvodu. Podívejte se na
							krátké video
						</Typography>
					</Box>
					<Video
						src="/assets/videos/example2.mp4"
						style={{
							flex: 3,
							minWidth: 300,
						}}
					/>
				</Box>
			</Box>

			<Divider />
			{/* FIFTH PAGE - Help us */}
			<Box
				paddingY={8}
				position={'relative'}
				display={'flex'}
				flexDirection={'row'}
				gap={4}
				flexWrap={'wrap'}
			>
				<HelpUsPanel />
				{false && (
					<Box
						display={'flex'}
						flexDirection={'column'}
						alignItems={'center'}
						gap={2}
						flexWrap={'wrap'}
						bgcolor={'grey.300'}
						boxShadow={'0px 2px 4px  rgba(0,0,0,0.2)'}
						padding={4}
						borderRadius={4}
						flex={1}
					>
						<Box
							display={'flex'}
							flexDirection={'column'}
							alignItems={'center'}
						>
							<Box
								display={'flex'}
								flexDirection={'row'}
								alignItems={'center'}
								gap={1}
							>
								<Image
									src={'/assets/icons/send-money.svg'}
									alt="Poslat peníze"
									width={40}
									height={40}
								/>
								<Typography variant="h2" noWrap>
									Podpořte nás
								</Typography>
							</Box>
							<Typography variant="h4" color="grey.600" align="center">
								Celou aplikaci jsme vytvářeli ve svém volném času, zadarmo. Za
								jakoukoliv finanční podporu budeme rádi.
							</Typography>
						</Box>
						<Box display={'flex'}>
							<Button color={'secondary'}>Finančně podpořit</Button>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	)
}

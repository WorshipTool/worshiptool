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
import { grey } from '@mui/material/colors'
import Shape from './shape.svg'
import Shape2 from './shape2.svg'

//TODO: fix overflow in better way.
import { Divider } from '@/common/ui'
import './styles.css'

export default SmartPage(Page, {
	transparentToolbar: true,
})

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
						height: 45,
					}}
				>
					<More />
				</Box>
			</Box>

			<Divider />
			{/* SECOND PAGE - Database */}
			<Box
				paddingY={8}
				position={'relative'}
				display={'flex'}
				flexDirection={'column'}
				gap={1}
			>
				<Box display={'flex'} flexDirection={'column'} gap={1}>
					<Typography variant="h2">Velká a aktuální databáze</Typography>

					<Typography
						variant="h4"
						sx={{
							maxWidth: 450,
						}}
						color="grey.600"
					>
						Základem celé aplikace je seznam chval. Tento seznam se snažíme
						držet co největší a dobře strukturovaný.
					</Typography>
				</Box>

				<Box
					display={'flex'}
					flexDirection={'row'}
					justifyContent={'space-between'}
					flexWrap={'wrap'}
					gap={1}
				>
					<Box
						flex={1}
						display={{
							xs: 'none',

							sm: 'flex',
						}}
						justifyContent={'center'}
						alignItems={'center'}
						padding={2}
						position={'relative'}
						minWidth={300}
						minHeight={300}
						sx={{}}
					>
						<Box
							style={{
								zIndex: 1,
								// transform: 'scaleX(-1)',
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translateX(-50%) translateY(-50%) scaleX(-1)',
							}}
							sx={{
								width: 300,
								aspectRatio: '3/2',
								position: 'relative',
							}}
						>
							<Box
								sx={{
									width: 200,
									aspectRatio: '2/1',
									position: 'relative',
									zIndex: 1,
								}}
							>
								<Image src={'/assets/bubble.svg'} alt="Bublina" fill />
								<Typography
									sx={{
										position: 'absolute',
										top: '50%',
										left: '50%',
										transform: 'translate(-50%, -50%) scaleX(-1) ',
									}}
									align="center"
									variant="h6"
								>
									Velikáá
								</Typography>
							</Box>
							<Box
								position={'relative'}
								sx={{
									width: 300,
									aspectRatio: '3/2',
									transform: 'translateY(-25%)',
								}}
							>
								<Image src={'/assets/sheeps/ovce2.svg'} alt="Ovečka" fill />
							</Box>
						</Box>
						<Box
							sx={{
								width: 400,
								height: 70,
								background: `radial-gradient(${grey[400]} 0%,${grey[400]} 10%, rgba(255,255,255,0) 40%)`,
								position: 'absolute',
								left: '50%',
								bottom: '0',
								transform: 'translateX(-50%) translateY(-45%)',
							}}
						/>
					</Box>
					<Box flex={1} maxWidth={500}>
						<Box
							display={'flex'}
							flexDirection={'column'}
							gap={2}
							maxWidth={400}
							minWidth={300}
						>
							<AboutInfoDatabase
								order={0}
								title="Rozsáhlost"
								text="Seskupujeme písně z jiných zpěvníků, abyste mohli hledat na jednom místě"
							/>
							<AboutInfoDatabase
								order={1}
								title="Aktuálnost"
								text="Abychom mohli nabídnout i nové písně, vyvinuli jsme chytrý algoritmus"
							/>
							<AboutInfoDatabase
								order={2}
								title="Váše písně"
								text="Databáze je otevřená - sami můžete přidávat chvály, veřejně i soukromě"
							/>
						</Box>
					</Box>
				</Box>
			</Box>

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

			<Box paddingY={8} position={'relative'}>
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
				<Box
					display={'flex'}
					flexDirection={'column'}
					gap={2}
					flexWrap={'wrap'}
					flex={1}
				>
					<Box display={'flex'} flexDirection={'column'}>
						<Typography variant="h2" noWrap>
							Chcete nám pomoct?
						</Typography>
						<Typography variant="h4" color="grey.600">
							Chtěli byste se k projektu jakýmkoliv způsobem připojit?
						</Typography>
					</Box>
					<Box display={'flex'}>
						<Button color={'primarygradient'}>Chci se připojit</Button>
					</Box>
				</Box>
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
					<Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
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
			</Box>
		</Box>
	)
}

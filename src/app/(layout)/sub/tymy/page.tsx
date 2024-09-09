import SectionLabelPill from '@/app/(layout)/o-nas/components/SectionLabelPill'
import CreateTeamButton from '@/app/(layout)/sub/tymy/components/CreateTeamButton'
import TeamsToolbarChanger from '@/app/(layout)/sub/tymy/components/ToolbarChanger'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import Image from 'next/image'
import JoinGroupPanel from './components/JoinGroupPanel.1'
import './teams.styles.css'

export default SmartPage(Page, {
	transparentToolbar: true,
})

function Page() {
	return (
		<Box position={'relative'}>
			<TeamsToolbarChanger />
			<Gap value={2} />
			<JoinGroupPanel />
			<Gap value={4} />
			<Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>
				<Box display={'flex'} flexDirection={'column'} gap={4}>
					<Box display={'flex'} flexDirection={'column'} gap={1}>
						<Box display={'flex'}>
							<SectionLabelPill label="Chválící týmy" />
						</Box>
						<Box display={'flex'} flexDirection={'column'}>
							<Typography strong className="about-title" variant="h1">
								Zjednodušte si
							</Typography>
							<Typography className="about-title" variant="h1">
								práci ve vašem
							</Typography>
							<Typography className="about-title" variant="h1">
								chválícím týmu
							</Typography>
						</Box>
					</Box>
					<Typography
						sx={{
							width: 400,
						}}
						variant="h3"
						strong={400}
						color="grey.500"
					>
						<strong>Zdarma</strong> nabízíme <strong>nástroje</strong>, které
						vám
						<strong>usnadní přípravu</strong> na společné hraní
					</Typography>
				</Box>
				<Box
					flex={1}
					display={'flex'}
					flexDirection={'column'}
					justifyContent={'center'}
					alignItems={'center'}
					position={'relative'}
				>
					<Gap value={4} />
					<Box
						sx={{
							position: 'absolute',
						}}
					>
						<Image
							src={'/assets/gradient-shapes/shape1.svg'}
							alt="Náhodný tvar na pozadí"
							width={500}
							height={500}
						/>
					</Box>
					<Box
						sx={{
							position: 'absolute',
						}}
					>
						<Image
							src={'/assets/gradient-shapes/shape2.svg'}
							alt="Náhodný tvar na pozadí"
							width={500}
							height={500}
							style={{
								transform: ' rotate(180deg) translate(0, 0px) scale(1.0)',
							}}
						/>
					</Box>
					<Box
						display={'flex'}
						flexDirection={'column'}
						justifyContent={'center'}
						alignItems={'center'}
						// zIndex={1}
						width={'100%'}
					>
						<Box
							// maxWidth={450 * 1.2}
							minWidth={400}
							width={'70%'}
							sx={{
								aspectRatio: '8 / 5',
							}}
							position={'relative'}
						>
							<Image
								src={'/assets/group-preview.png'}
								alt="Ukázka obrazovky týmu"
								fill
							/>
						</Box>
						<Box marginBottom={4}>
							<CreateTeamButton />
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

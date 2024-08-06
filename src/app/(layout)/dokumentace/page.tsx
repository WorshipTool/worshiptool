import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Grid, Paper, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import ContainerGrid from '../../../common/components/ContainerGrid'
import { generateMetadataTitle } from '../../../hooks/window-title/tech'
import FeedbackPanel from './components/FeedbackPanel'
import { getReadmeRawData } from './hooks/useReadme'

export const generateMetadata = async () => {
	return {
		title: await generateMetadataTitle('O aplikaci', 'documentation', {}),
	}
}

export default SmartPage(Documentation)
async function Documentation() {
	const raw = await getReadmeRawData()

	return (
		<>
			<Box display={'flex'} justifyContent={'center'} padding={2}>
				<ContainerGrid sx={{ justifyContent: 'center' }} direction="row">
					<Grid item xs={12}>
						<FeedbackPanel />
						<Typography variant="h6">Dokumentace</Typography>
						<Paper
							sx={{
								padding: 4,
							}}
						>
							<Box>
								<ReactMarkdown>{raw}</ReactMarkdown>
							</Box>
						</Paper>
					</Grid>
					<Box
						flex={1}
						display={'flex'}
						justifyContent={'end'}
						paddingTop={1}
						sx={{ opacity: 0.3 }}
					>
						<Typography variant="caption">Načteno ze souboru .md</Typography>
					</Box>
				</ContainerGrid>
			</Box>
		</>
	)
}

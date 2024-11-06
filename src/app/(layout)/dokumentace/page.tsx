import { generateSmartMetadata } from '@/tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata('documentation', () => {
	return {
		title: 'O aplikaci',
	}
})

// export default SmartPage(Documentation)
// async function Documentation() {
// 	const raw = await getReadmeRawData()

// 	return (
// 		<>
// 			<Box display={'flex'} justifyContent={'center'} padding={2}>
// 				<ContainerGrid sx={{ justifyContent: 'center' }} direction="row">
// 					<Grid item xs={12}>
// 						<FeedbackPanel />
// 						<Typography variant="h6">Dokumentace</Typography>
// 						<Paper
// 							sx={{
// 								padding: 4,
// 							}}
// 						>
// 							<Box>
// 								<ReactMarkdown>{raw}</ReactMarkdown>
// 							</Box>
// 						</Paper>
// 					</Grid>
// 					<Box
// 						flex={1}
// 						display={'flex'}
// 						justifyContent={'end'}
// 						paddingTop={1}
// 						sx={{ opacity: 0.3 }}
// 					>
// 						<Typography>Načteno ze souboru .md</Typography>
// 					</Box>
// 				</ContainerGrid>
// 			</Box>
// 		</>
// 	)
// }

export default function D() {
	return <>baf</>
}

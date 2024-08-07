'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { MAIL } from '@/common/constants/contact'
import { Gap } from '@/common/ui/Gap'
import { StandaloneCard } from '@/common/ui/StandaloneCard'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'

export default SmartPage(ContactPage)

function ContactPage() {
	return (
		<Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
			<Gap value={3} />
			<StandaloneCard
				title="Kontakt"
				subtitle="Chcete se na něco zeptat nebo máte nějaký nápad? Rádi od vás uslyšíme."
			>
				<Gap value={2} />
				<Box display={'flex'} flexDirection={'row'} gap={1} fontSize={'1.1rem'}>
					<Typography size={'inherit'}>Napište nám na</Typography>
					<Typography strong size={'inherit'}>
						{MAIL.MAIN}
					</Typography>
				</Box>
			</StandaloneCard>
		</Box>
	)
}

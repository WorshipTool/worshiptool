'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { MAIL } from '@/common/constants/contact'
import { Button } from '@/common/ui/Button'
import { StandaloneCard } from '@/common/ui/StandaloneCard'
import { TextInput } from '@/common/ui/TextInput'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import { useState } from 'react'

export default SmartPage(ContactPage)

function ContactPage() {
	const [sent, setSent] = useState(false)

	const onSubmitHandle = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log('submit')

		setSent(true)
	}

	return (
		<Box
			display={'flex'}
			alignItems={'center'}
			flexDirection={'column'}
			gap={2}
			marginTop={3}
		>
			<StandaloneCard
				title="Kontakt"
				subtitle="Chcete se na něco zeptat nebo máte nějaký nápad? Rádi od vás uslyšíme."
			>
				<Box display={'flex'} flexDirection={'row'} gap={1} fontSize={'1.1rem'}>
					<Typography size={'inherit'}>Napište nám na</Typography>
					<Typography strong size={'inherit'}>
						{MAIL.MAIN}
					</Typography>
				</Box>
			</StandaloneCard>

			<StandaloneCard
				title="Zpětná vazba"
				variant="secondary"
				subtitle="Líbí se vám naše aplikace, nebo máte nějaké přípomínky? Napište nám pomocí formuláře."
			>
				{!sent ? (
					<form
						style={{
							width: '100%',
						}}
						onSubmit={onSubmitHandle}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 1,
							}}
						>
							<Box display={'flex'} flexDirection={'row'} gap={1}>
								<TextInput placeholder="Zadejte vaše jméno" required />
								<TextInput
									placeholder="Zadejte váš E-mail"
									type="email"
									required
								/>
							</Box>
							<TextInput
								placeholder="Napište zprávu"
								required
								multiline
								sx={{
									height: '100px',
									overflowY: 'scroll',
								}}
							/>
							<Button type="submit">Poslat zprávu</Button>
						</Box>
					</form>
				) : (
					<>
						<Button
							onClick={() => setSent(false)}
							size="small"
							variant="text"
							color="grey.500"
							tooltip="Napsat další zprávu"
						>
							Zpráva byla odeslána... Děkujeme za váš názor.
						</Button>
					</>
				)}
			</StandaloneCard>
		</Box>
	)
}

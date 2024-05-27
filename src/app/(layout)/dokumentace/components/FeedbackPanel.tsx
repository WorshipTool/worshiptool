'use client'
import { Try } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Paper, TextField, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { PostSendMessageDTO } from '../../../../api/dtos/feedbackDtos'
import { MessengerApi } from '../../../../api/generated'
import { Gap } from '../../../../common/ui/Gap/Gap'
import useAuth from '../../../../hooks/auth/useAuth'
import { useApiState } from '../../../../tech/ApiState'

export default function FeedbackPanel() {
	const [message, setMessage] = useState('')
	const [sent, setSent] = useState(false)
	const [sending, setSending] = useState(false)

	const { user, isLoggedIn, apiConfiguration } = useAuth()
	const messApi = new MessengerApi(apiConfiguration)
	const { fetchApiState, apiState } = useApiState()

	const onMessageChange = (e: any) => {
		setMessage(e.target.value)
	}

	const send = () => {
		setSending(true)

		const body: PostSendMessageDTO = {
			message: message.replaceAll('\n', '\\n'),
			userName: isLoggedIn()
				? user?.firstName + ' ' + user?.lastName
				: undefined,
		}
		fetchApiState(
			async () => {
				return await messApi.messengerControllerPostFeedback(body)
			},
			() => {
				setSent(true)
			}
		)
	}

	const theme = useTheme()
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Box
				sx={{
					[theme.breakpoints.down('sm')]: {
						display: 'none',
					},
				}}
			>
				<Gap value={3} />
			</Box>
			{!sent ? (
				<Paper
					sx={{
						backgroundColor: 'white',
						padding: 2,
						paddingX: 2,
						borderRadius: 2,
						display: 'flex',
						flexDirection: 'column',
						borderColor: 'primary.light',
						borderWidth: 3,
						borderStyle: 'solid',
						[theme.breakpoints.up('md')]: {
							marginX: 4,
						},
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<Try />
						<Gap value={1} horizontal />
						<Typography variant="h6">Zpětná vazba</Typography>
					</Box>
					<Typography variant="body2">
						Napište nám, co bychom měli zlepšit, co se vám líbí, co vám chybí...
					</Typography>
					<Gap value={2} />
					<TextField
						id="outlined-basic"
						label="Chcete nám něco sdělit?"
						variant="outlined"
						multiline
						value={message}
						onChange={onMessageChange}
						sx={{
							flex: 1,
						}}
						size="small"
						disabled={sending}
					/>
					<Gap />
					<Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
						<LoadingButton
							variant="contained"
							color="primary"
							size="medium"
							onClick={send}
							loading={sending}
						>
							Odeslat
						</LoadingButton>
					</Box>
				</Paper>
			) : (
				<>
					<Typography>
						Odesláno... <b>Díky za zpětnou vazbu!</b>
					</Typography>
				</>
			)}

			<Gap value={4} />
		</Box>
	)
}

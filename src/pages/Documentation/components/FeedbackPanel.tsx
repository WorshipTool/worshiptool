import { Box, Button, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import Gap from '../../../components/Gap'
import { Feedback, Try } from '@mui/icons-material';
import useFetch from '../../../hooks/useFetch';
import { getUrl } from '../../../apis/urls';
import { POSTSENDFEEDBACK_URL } from '../../../apis/constants';
import { PostSendMessageDTO } from '../../../apis/dtos/feedbackDtos';
import useAuth from '../../../hooks/auth/useAuth';
import { LoadingButton } from '@mui/lab';

export default function FeedbackPanel() {
    const [message, setMessage] = React.useState("");
    const [sent, setSent] = React.useState(false);
    const [sending, setSending] = React.useState(false);

    const {post} = useFetch();
    const {user, isLoggedIn} = useAuth()

    const onMessageChange = (e:any) => {
        setMessage(e.target.value);
    }

    const send = () => {
        setSending(true);

        const body: PostSendMessageDTO = {
            message: message.replaceAll("\n", "\\n"),
            userName: isLoggedIn() ? user?.firstName + " " + user?.lastName : undefined
        }
        post({url: getUrl(POSTSENDFEEDBACK_URL), body}).then((result)=>{
            setSent(true);
            setSending(false);
        });
    }
  return (
    <Box sx={{
        display: "flex",
        flexDirection: "column",
    }}>

        <Gap value={3}/>
        {!sent ? (
            <Paper sx={{
                backgroundColor: "white",
                padding: 2,
                paddingX: 2,
                marginX:4,
                // borderRadius: 1,
                display:"flex",
                flexDirection: "column",
                borderColor: "primary.light",
                borderWidth: 2,
                borderStyle: "solid"
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                
                }}>
                    <Try /> 
                    <Gap value={1} horizontal/>
                    <Typography variant="h6">
                        
                    Zpětná vazba
                    </Typography>
                </Box>
                <Typography variant="body2">
                    Napište nám, co bychom měli zlepšit, co se vám líbí, co vám chybí...
                </Typography>
                <Gap value={2}/>
                <TextField id="outlined-basic" label="Chcete nám něco sdělit?" variant="outlined" multiline
                    value={message} onChange={onMessageChange} sx={{
                        flex: 1
                    }} 
                    size='small'
                    disabled={sending}/>
                <Gap />
                <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} >
                    <LoadingButton variant="contained" color="primary" size="medium" onClick={send}
                        loading={sending}>
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

        <Gap value={4}/>
    </Box>
  )
}

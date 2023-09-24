import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material'
import React from 'react'
import Gap from '../../../components/Gap'
import { Feedback, Try } from '@mui/icons-material';

export default function FeedbackPanel() {
    const [message, setMessage] = React.useState("");
    const [sent, setSent] = React.useState(false);

    const onMessageChange = (e:any) => {
        setMessage(e.target.value);
    }

    const send = () => {
        setSent(true);

    }
  return (
    <Box sx={{
        display: "flex",
        flexDirection: "column",
    }}>

        <Gap value={3}/>
        {!sent ? (
            <Box display={'flex'} flexDirection={"row"}>
                <TextField id="outlined-basic" label="Chcete nám něco sdělit?" variant="outlined" multiline
                    value={message} onChange={onMessageChange} sx={{
                        flex: 1,
                        bgcolor:"white"
                    }} InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Try />
                          </InputAdornment>
                        ),
                      }}/>
                <Gap horizontal/>
                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                    <Button variant="contained" color="primary" size="medium" onClick={send}>Odeslat</Button>
                </Box>
            </Box>
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

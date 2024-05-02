import { Info } from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    styled,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import { useState } from "react";
import { LoginResultDTO } from "../../api/dtos/dtosAuth";
import AppLayout from "../../components/app/AppLayout/AppLayout";
import Gap from "../../components/Gap";
import useAuth from "../../hooks/auth/useAuth";
import { useWindowTitle } from "../../hooks/useWindowTitle";
import { useSmartLocation, useSmartNavigate } from "../../routes";
import GoogleLoginButton from "./components/GoogleLoginButton";
import { useNavigate } from "react-router-dom";

const StyledContainer = styled(Paper)(({ theme }) => ({
    width: "30%",
    padding: 30,
    [theme.breakpoints.down("md")]: {
        width: "50%"
    },
    [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: 10
    }
}));

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isEmailOk, setIsEmailOk] = useState(true);
    const [emailMessage, setEmailMessage] = useState("");

    const [isPasswordOk, setIsPasswordOk] = useState(true);
    const [passwordMessage, setPasswordMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [inProgress, setInProgress] = useState(false);

    const theme = useTheme();
    const navigate = useSmartNavigate();
    const nvt = useNavigate();

    const { login } = useAuth();
    const { state } = useSmartLocation("login");
    const _ = useWindowTitle("Přihlášení");

    const onEmailChange = (e: any) => {
        setEmail(e.target.value);
    };
    const onPasswordChange = (e: any) => {
        setPassword(e.target.value);
    };

    const afterGoogleLogin = () => {
        if (state?.previousPage) {
            nvt(state.previousPage);
        } else {
            navigate("home", {});
        }
    };

    const onLoginClick = () => {
        let ok = true;
        if (email == "") {
            setIsEmailOk(false);
            setEmailMessage("Zadejte email");
            ok = false;
        } else {
            setIsEmailOk(true);
            setEmailMessage("");
        }

        if (password == "") {
            setIsPasswordOk(false);
            setPasswordMessage("Zadejte heslo");
            ok = false;
        } else {
            setIsPasswordOk(true);
            setPasswordMessage("");
        }

        if (ok) loginAction();
    };

    const loginAction = () => {
        setInProgress(true);
        login({ email, password }, (result: LoginResultDTO) => {
            setInProgress(false);
            if (!result.user) {
                setErrorMessage("Špatný email nebo heslo");
                return;
            }

            if (state?.previousPage) {
                nvt(state.previousPage);
            } else {
                navigate("home", {});
            }
        });
    };

    return (
        <AppLayout>
            <Box
                flex={1}
                display={"flex"}
                justifyContent={"center"}
                flexDirection={"column"}
                alignItems={"center"}
                paddingTop={5}>
                {state.message && (
                    <StyledContainer
                        style={{
                            marginBottom: theme.spacing(2),
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: theme.spacing(1)
                        }}>
                        <Info fontSize="large" color="info" />
                        <Typography>{state.message}</Typography>
                    </StyledContainer>
                )}
                <StyledContainer>
                    <Box display={"flex"} flexDirection={"column"}>
                        <Typography variant={"h5"} fontWeight={"bold"} flex={1}>
                            Která jsi ovce?
                        </Typography>
                    </Box>
                    <Gap />
                    {errorMessage != "" && (
                        <>
                            <Typography variant="subtitle2" color={"red"}>
                                {errorMessage}
                            </Typography>
                            <Gap />
                        </>
                    )}

                    <Typography variant="subtitle2">Email</Typography>
                    <TextField
                        size="small"
                        fullWidth
                        value={email}
                        onChange={onEmailChange}
                        error={!isEmailOk}
                        helperText={emailMessage}
                        disabled={inProgress}
                        type="email"
                    />
                    <Gap />
                    <Typography variant="subtitle2">Heslo</Typography>
                    <TextField
                        size="small"
                        fullWidth
                        value={password}
                        onChange={onPasswordChange}
                        error={!isPasswordOk}
                        helperText={passwordMessage}
                        disabled={inProgress}
                        type="password"
                    />
                    <Gap />

                    <Button onClick={onLoginClick}>
                        Přihlásit se
                        {inProgress && (
                            <CircularProgress
                                color={"inherit"}
                                size={16}
                                sx={{ marginLeft: 1 }}
                            />
                        )}
                    </Button>

                    <Box
                        display={"flex"}
                        flexDirection={"row"}
                        alignItems={"center"}
                        justifyContent={"end"}>
                        <Typography variant={"subtitle2"}>
                            Nemáte ještě účet?
                        </Typography>
                        <Button
                            size={"small"}
                            onClick={() => {
                                navigate("signup", {});
                            }}>
                            Vytvořte si ho
                        </Button>
                    </Box>
                    <Gap value={2} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "end"
                        }}>
                        <GoogleLoginButton afterLogin={afterGoogleLogin} />
                    </Box>
                </StyledContainer>
            </Box>
        </AppLayout>
    );
}

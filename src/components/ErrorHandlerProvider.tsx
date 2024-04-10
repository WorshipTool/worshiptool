import React, { useEffect } from "react";
import { networkErrorEvent, unauthorizedEvent } from "../tech/handleApiCall";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import useAuth from "../hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../routes/routes";
import { useSmartNavigate } from "../routes/useSmartNavigate";

interface ErrorHandlerProviderProps {
    children: React.ReactNode;
}

export default function ErrorHandlerProvider(props: ErrorHandlerProviderProps) {
    const { enqueueSnackbar } = useSnackbar();
    const { isLoggedIn, signup } = useAuth();
    const navigate = useSmartNavigate();

    useEffect(() => {
        const ne = () => {
            enqueueSnackbar("Nelze se spojit se serverem.", {
                variant: "error",
                persist: true,
                preventDuplicate: true,
                action: () => {
                    return (
                        <Button
                            onClick={() => window.location.reload()}
                            color="inherit"
                            variant="outlined"
                            size="small">
                            Zkusit to znovu
                        </Button>
                    );
                }
            });
        };

        const ue = () => {
            navigate("login", {
                state: {
                    previousPage: window.location.pathname
                }
            });
            enqueueSnackbar("Je třeba se znovu přihlásit.", {
                // variant: "error",
                persist: true
            });
            // enqueueSnackbar("Problém s autorizací.", {
            //     variant: "error",
            //     persist: true
            // });
        };
        window.addEventListener(networkErrorEvent.type, ne);
        window.addEventListener(unauthorizedEvent.type, ue);

        return () => {
            window.removeEventListener(networkErrorEvent.type, ne);
            window.removeEventListener(unauthorizedEvent.type, ue);
        };
    }, []);
    return <>{props.children}</>;
}

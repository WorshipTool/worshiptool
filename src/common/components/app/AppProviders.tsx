import { ThemeProvider } from "@emotion/react";
import { Box, styled } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../../hooks/auth/useAuth";
import { GroupProvider } from "../../../hooks/group/useGroup";
import { PlaylistProvider } from "../../../hooks/playlist/useCurrentPlaylist";
import { StackProvider } from "../../../hooks/playlist/useStack";
import { AppRoutes } from "../../../routes/AppRoutes";
import ErrorHandlerProvider from "./providers/ErrorHandlerProvider";
import Snow from "../Snow";
import AppContainer from "./AppContainer";
import { theme } from "./theme";
import App from "../../../App";
import { WindowTitleProvider } from "../../../hooks/useWindowTitle";
import SearchGroupDialog from "../Toolbars/components/Toolsmenu/components/SearchGroupDialog";

type AppProvidersProps = {
    children?: React.ReactNode;
};

export default function AppProviders(props: AppProvidersProps) {
    return (
        <GoogleOAuthProvider clientId="736869166999-nckrpcdmab26hkp7s1cjbgdfu51igac9.apps.googleusercontent.com">
            <SnackbarProvider
                maxSnack={1}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                autoHideDuration={3000}>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <WindowTitleProvider>
                            <AuthProvider>
                                <ErrorHandlerProvider>
                                    <StackProvider>
                                        <GroupProvider>
                                            <PlaylistProvider>
                                                {props.children}
                                            </PlaylistProvider>
                                        </GroupProvider>
                                    </StackProvider>
                                </ErrorHandlerProvider>
                            </AuthProvider>
                        </WindowTitleProvider>
                    </BrowserRouter>
                </ThemeProvider>
            </SnackbarProvider>
        </GoogleOAuthProvider>
    );
}

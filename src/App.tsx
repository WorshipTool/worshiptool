import React, { useEffect } from "react";
import { Box, ThemeProvider, Typography, styled } from "@mui/material";
import {
    BrowserRouter,
    createBrowserRouter,
    Route,
    RouterProvider,
    Routes,
    useParams
} from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Create from "./pages/add_new_song/Write/Create";
import { createTheme } from "@mui/material";
import { AuthProvider } from "./hooks/auth/useAuth";
import Account from "./pages/Account/Account";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import PlaylistPreview from "./pages/Playlist/PlaylistPreview";
import { StackProvider } from "./hooks/playlist/useStack";
import List from "./pages/List/List";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import PlaylistsList from "./pages/PlaylistsList/PlaylistsList";
import SlideCard from "./pages/PlaylistCards/SlideCard/SlideCard";
import PlaylistCards from "./pages/PlaylistCards/PlaylistCards";
import Documentation from "./pages/Documentation/Documentation";
import GroupHome from "./pages/GroupHome/GroupScreen";
import GroupScreen from "./pages/GroupHome/GroupScreen";
import { GroupProvider } from "./hooks/group/useGroup";
import { PlaylistProvider } from "./hooks/playlist/useCurrentPlaylist";
import PlaylistScreen from "./pages/Playlist/PlaylistScreen";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AddMenu from "./pages/add_new_song/AddMenu/AddMenu";
import Upload from "./pages/add_new_song/AddMenu/Upload/Upload";
import Parse from "./pages/add_new_song/AddMenu/Upload/components/Parse/Parse";
import MySongsList from "./pages/MySongsList/MySongsList";
import Snowfall from "react-snowfall";
import Snow from "./components/Snow";
import Test from "./pages/Test/Test";
import ErrorHandlerProvider from "./components/ErrorHandlerProvider";
import SongRoutePage from "./pages/Sheet/SongRoutePage";
import {
    ACCOUNT_URL,
    ADD_MENU_URL,
    DOCUMENTATION_URL,
    GROUP_URL,
    LOGIN_URL,
    PLAYLIST_CARDS_URL,
    PLAYLIST_URL,
    SIGNUP_URL,
    SONGS_LIST_URL,
    TEST_URL,
    UPLOAD_PARSE_URL,
    UPLOAD_URL,
    USERS_PLAYLISTS_URL,
    USERS_SONGS_URL,
    VARIANT_URL,
    WRITE_SONG_URL
} from "./routes/routes";

const Background = styled(Box)(({ theme }) => ({
    background: `linear-gradient(160deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
    position: "fixed",
    width: "100%",
    height: "100%",
    zIndex: -100
}));

const theme = createTheme({
    palette: {
        primary: {
            main: "#0085FF",
            dark: "#532EE7"
        },
        secondary: {
            main: "#EBBC1E"
        },
        success: {
            main: "#43a047"
        }
    }
});

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path={SONGS_LIST_URL} element={<List />} />
            <Route path={LOGIN_URL} element={<Login />} />
            <Route path={SIGNUP_URL} element={<SignUp />} />
            <Route path={ACCOUNT_URL} element={<Account />} />
            <Route path={USERS_PLAYLISTS_URL} element={<PlaylistsList />} />
            <Route path={USERS_SONGS_URL} element={<MySongsList />} />
            <Route path={VARIANT_URL} element={<SongRoutePage />} />
            <Route path={ADD_MENU_URL} element={<AddMenu />} />
            <Route path={UPLOAD_URL} element={<Upload />} />
            <Route path={UPLOAD_PARSE_URL} element={<Parse />} />
            <Route path={WRITE_SONG_URL} element={<Create />} />
            {/* <Route path="add/write/:guid" element={<Create />} /> */}
            <Route path={PLAYLIST_URL} element={<PlaylistScreen />} />
            <Route path={PLAYLIST_CARDS_URL} element={<PlaylistCards />} />
            <Route path={DOCUMENTATION_URL} element={<Documentation />} />
            <Route path={GROUP_URL} element={<GroupScreen />} />
            <Route path={TEST_URL} element={<Test />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
};

function App() {
    return (
        <div>
            <GoogleOAuthProvider clientId="736869166999-nckrpcdmab26hkp7s1cjbgdfu51igac9.apps.googleusercontent.com">
                <SnackbarProvider
                    maxSnack={1}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    autoHideDuration={3000}>
                    <ThemeProvider theme={theme}>
                        <BrowserRouter>
                            <AuthProvider>
                                <ErrorHandlerProvider>
                                    <StackProvider>
                                        <GroupProvider>
                                            <PlaylistProvider>
                                                <Background />
                                                <AppRoutes />
                                            </PlaylistProvider>
                                        </GroupProvider>
                                    </StackProvider>
                                </ErrorHandlerProvider>
                            </AuthProvider>
                        </BrowserRouter>
                    </ThemeProvider>
                </SnackbarProvider>
            </GoogleOAuthProvider>

            <Snow />
        </div>
    );
}

export default App;

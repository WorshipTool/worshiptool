import React, { useEffect } from 'react';
import { Box, ThemeProvider, Typography, styled } from '@mui/material';
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  useParams,
} from "react-router-dom";
import Home from './pages/Home/Home';
import "./App.css";
import Create from './pages/Create/Create';
import { createTheme } from '@mui/material';
import Sheet from './pages/Sheet/Sheet';
import { AuthProvider } from './hooks/auth/useAuth';
import Account from './pages/Account/Account';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import PlaylistPreview from './pages/Playlist/PlaylistPreview';
import { StackProvider } from './hooks/playlist/useStack';
import List from './pages/List/List';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import PlaylistsList from './pages/PlaylistsList/PlaylistsList';
import SlideCard from './pages/PlaylistCards/SlideCard/SlideCard';
import PlaylistCards from './pages/PlaylistCards/PlaylistCards';
import Documentation from './pages/Documentation/Documentation';
import GroupHome from './pages/GroupHome/GroupScreen';
import GroupScreen from './pages/GroupHome/GroupScreen';
import { GroupProvider } from './hooks/group/useGroup';
import { PlaylistProvider } from './hooks/playlist/useCurrentPlaylist';
import PlaylistScreen from './pages/Playlist/PlaylistScreen';


const Background = styled(Box)(({theme})=>({
  background: `linear-gradient(160deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
  position:"fixed",
  width:"100%",
  height:"100%",
  zIndex:-100,
  
}))

const theme = createTheme({
  palette: {
    primary: {
      main: '#0085FF',
      dark: '#532EE7'
    },
    secondary: {
      main: "#EBBC1E",
    }

  },
});


export const NavigationProvider = () => {
  return <BrowserRouter>
    <AppRoutes/>
  </BrowserRouter>
}

export const AppRoutes = () => {
  return <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="list" element={<List/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="signup" element={<SignUp/>}/>
      <Route path="account" element={<Account/>}/>
      <Route path="account/playlists" element={<PlaylistsList/>}/>
      <Route path="song/:guid" element={<Sheet/>}/>
      <Route path="create" element={<Create/>}/>
      <Route path="create/:guid" element={<Create/>}/>
      <Route path="playlist/:guid" element={<PlaylistScreen/>}/>
      <Route path="playlist/cards/:guid" element={<PlaylistCards/>}/>
      <Route path='documentation' element={<Documentation/>}/>
      <Route path='group/:groupName' element={<GroupScreen/>}/>
      <Route path="*" element={<ErrorPage/>}/>
    </Routes>
  
}


function App() {

    return (
      <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={3000}>        
        <ThemeProvider theme={theme}>
          <AuthProvider> 
              <StackProvider>
                  <GroupProvider>
                    <PlaylistProvider>
                      <Background/>
                      <NavigationProvider/>
                    </PlaylistProvider>
                  </GroupProvider>
              </StackProvider>
          </AuthProvider>
        </ThemeProvider>
      </SnackbarProvider>
    )
}

export default App;

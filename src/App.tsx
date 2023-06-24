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
import TestPage from './pages/Test/TestPage';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import PlaylistPreview from './pages/Playlist/PlaylistPreview';
import { StackProvider } from './hooks/playlist/useStack';
import List from './pages/List/List';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import useGroup, { GroupProvider } from './hooks/group/useGroup';
import PlaylistsList from './pages/PlaylistsList/PlaylistsList';
import SlideCard from './pages/PlaylistCards/SlideCard/SlideCard';
import PlaylistCards from './pages/PlaylistCards/PlaylistCards';


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
    },
    secondary: {
      main: "#F500AE",
    }

  },
});

export const GroupRoutesProvider = () => {
  const {setGroupName} = useGroup();
  const {groupName} = useParams();
  useEffect(() => {
      setGroupName(groupName);
    }, []);
  
  return <AppRoutes/>
}

export const NongroupRoutesProvider = () => {
  const {setGroupName} = useGroup();
  useEffect(() => {
      setGroupName(undefined);
    }, []);
  
  return <AppRoutes/>
}

export const NavigationProvider = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="group/:groupName/*" element={<GroupRoutesProvider/>}/>
      <Route path="*" element={<NongroupRoutesProvider/>}/>
    </Routes>
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
      <Route path="playlist/:guid" element={<PlaylistPreview/>}/>
      <Route path="playlist/cards/:guid" element={<PlaylistCards/>}/>
      <Route path="test" element={<TestPage/>}/>
      <Route path="*" element={<ErrorPage/>}/>
    </Routes>
  
}


function App() {

    return (
      <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={3000}>        
        <ThemeProvider theme={theme}>
          <AuthProvider> 
            <GroupProvider>
              <StackProvider>
                    <Background/>
                    a
                    <NavigationProvider/>

                  </StackProvider>
            </GroupProvider>
          </AuthProvider>
        </ThemeProvider>
      </SnackbarProvider>
    )
}

export default App;
